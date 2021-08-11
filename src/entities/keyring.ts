import { Column, Entity, ValueTransformer } from 'typeorm'
import { Base } from './base'
import { HexKeyPair } from '@unid/wallet-sdk-base-connector'

const transformer: ValueTransformer = {
    from: (value) => {
        try {
            return JSON.parse(value)
        } catch (err) {
            return undefined
        }
    },
    to: (value) => {
        try {
            return JSON.stringify(value)
        } catch (err) {
            return undefined
        }
    },
}

@Entity({ name: 'keyrings' })
export class Keyring extends Base {
    @Column('text', {
        nullable: true,
        comment : '',
    })
    did?: string

    @Column('text', {
        nullable: false,
        comment : '',
        transformer: transformer,
    })
    sign!: HexKeyPair

    @Column('text', {
        nullable: false,
        comment : '',
        transformer: transformer,
    })
    update!: HexKeyPair

    @Column('text', {
        nullable: false,
        comment : '',
        transformer: transformer,
    })
    recovery!: HexKeyPair

    @Column('text', {
        nullable: false,
        comment : '',
        transformer: transformer,
    })
    encrypt!: HexKeyPair

    @Column('text', {
        nullable: true,
        comment : '',
    })
    mnemonic?: string

    @Column('text', {
        nullable: false,
        comment : '',
    })
    seed!: string
}