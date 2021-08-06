import { Connection } from 'typeorm'
import { BaseConnector, Id, MnemonicKeyringModel, UNiDInvalidDataError, UNiDNotImplementedError } from '@unid/wallet-sdk-base-connector'
import { Keyring } from './entities/keyring'

export class SqliteConnector extends BaseConnector<Connection> {
    /**
     * @param payload 
     * @returns
     */
    async insert(payload: MnemonicKeyringModel): Promise<Id<MnemonicKeyringModel>> {
        const encrypted = await this.encryptModel(payload)
        const model  = Keyring.create(encrypted)
        const result = await model.save()

        return Object.assign<Id<{}>, MnemonicKeyringModel>({ _id: result.id }, payload)
    }

    /**
     * @param _id 
     * @param payload 
     * @returns
     */
    async update(_id: string, payload: MnemonicKeyringModel): Promise<Id<MnemonicKeyringModel>> {
        const encrypted = await this.encryptModel(payload)
        const model = await Keyring.findOne(_id)

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

        const result = await model.save()

        return Object.assign<Id<{}>, MnemonicKeyringModel>({ _id: result.id }, payload)
    }

    /**
     * @param did 
     * @returns
     */
    async findByDid(did: string): Promise<Id<MnemonicKeyringModel> | undefined> {
        const model = await Keyring.findOne({ where: { did: did }})

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