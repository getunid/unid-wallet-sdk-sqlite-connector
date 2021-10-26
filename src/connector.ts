import "reflect-metadata";
import { createConnection, getManager } from 'typeorm'
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions'
import { BaseConnector, Id, MnemonicKeyringModel, UNiDInvalidDataError, UNiDNotImplementedError } from '@getunid/wallet-sdk-base-connector'
import { Keyring } from './entities/keyring'
import { CONNECTION_NAME, getConfig } from './ormconfig'

export class SqliteConnector extends BaseConnector<string> {
    /**
     */
    public async init() {
        let config: SqliteConnectionOptions = getConfig(this.context.client)

        await createConnection(config)
    }

    /**
     * @param payload 
     * @returns
     */
    async insert(payload: MnemonicKeyringModel): Promise<Id<MnemonicKeyringModel>> {
        const manager = getManager(CONNECTION_NAME)

        const encrypted = await this.encryptModel(payload)
        const model  = manager.create(Keyring, encrypted)
        const result = await manager.save(model)

        return Object.assign<Id<{}>, MnemonicKeyringModel>({ _id: result.id }, payload)
    }

    /**
     * @param _id 
     * @param payload 
     * @returns
     */
    async update(_id: string, payload: MnemonicKeyringModel): Promise<Id<MnemonicKeyringModel>> {
        const manager = getManager(CONNECTION_NAME)

        const encrypted = await this.encryptModel(payload)
        const model = await manager.findOne(Keyring, _id)

        if (model === undefined) {
            throw new UNiDInvalidDataError()
        }

        model.did      = encrypted.did
        model.sign     = encrypted.sign
        model.update   = encrypted.update
        model.recovery = encrypted.recovery
        model.encrypt  = encrypted.encrypt
        model.mnemonic = encrypted.mnemonic
        model.seed     = encrypted.seed

        const result = await manager.save(model)

        return Object.assign<Id<{}>, MnemonicKeyringModel>({ _id: result.id }, payload)
    }

    /**
     * @param did 
     * @returns
     */
    async findByDid(did: string): Promise<Id<MnemonicKeyringModel> | undefined> {
        const manager = getManager(CONNECTION_NAME)

        const model = await manager.findOne(Keyring, { where: { did: did }})

        if (model !== undefined) {
            const decrypted = await this.decryptModel(model)

            return Object.assign<Id<{}>, MnemonicKeyringModel>({ _id: model.id }, decrypted)
        } else {
            return undefined
        }
    }

    /**
     * @param _ 
     */
    async deleteById(_: MnemonicKeyringModel): Promise<MnemonicKeyringModel> {
        throw new UNiDNotImplementedError()
    }

    /**
     * @param model 
     * @returns
     */
    private async encryptModel(model: MnemonicKeyringModel): Promise<MnemonicKeyringModel> {
        model.sign.private = (await this.context.encrypter(
            Buffer.from(model.sign.private, 'utf-8'), this.context.secret
        )).toString('base64')

        model.update.private = (await this.context.encrypter(
            Buffer.from(model.update.private, 'utf-8'), this.context.secret
        )).toString('base64')

        model.recovery.private = (await this.context.encrypter(
            Buffer.from(model.recovery.private, 'utf-8'), this.context.secret
        )).toString('base64')

        model.encrypt.private = (await this.context.encrypter(
            Buffer.from(model.encrypt.private, 'utf-8'), this.context.secret
        )).toString('base64')

        model.seed = (await this.context.encrypter(
            Buffer.from(model.seed, 'utf-8'), this.context.secret
        )).toString('base64')

        if (model.mnemonic !== undefined && model.mnemonic !== null) {
            model.mnemonic = (await this.context.encrypter(
                Buffer.from(model.mnemonic, 'utf-8'), this.context.secret
            )).toString('base64')
        }

        return model
    }

    /**
     * @param model 
     * @returns
     */
    private async decryptModel(model: MnemonicKeyringModel): Promise<MnemonicKeyringModel> {
        model.sign.private = (await this.context.decrypter(
            Buffer.from(model.sign.private, 'base64'), this.context.secret
        )).toString('utf-8')

        model.update.private = (await this.context.decrypter(
            Buffer.from(model.update.private, 'base64'), this.context.secret
        )).toString('utf-8')

        model.recovery.private = (await this.context.decrypter(
            Buffer.from(model.recovery.private, 'base64'), this.context.secret
        )).toString('utf-8')

        model.encrypt.private = (await this.context.decrypter(
            Buffer.from(model.encrypt.private, 'base64'), this.context.secret
        )).toString('utf-8')

        model.seed = (await this.context.decrypter(
            Buffer.from(model.seed, 'base64'), this.context.secret
        )).toString('utf-8')

        if (model.mnemonic !== undefined && model.mnemonic !== null) {
            model.mnemonic = (await this.context.decrypter(
                Buffer.from(model.mnemonic, 'base64'), this.context.secret
            )).toString('utf-8')
        }

        return model
    }
}