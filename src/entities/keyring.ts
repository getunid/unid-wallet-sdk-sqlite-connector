import { Column, Entity } from 'typeorm'
import { Base } from './base'
import { HexKeyPair } from '@unid/wallet-sdk-base-connector'

@Entity({ name: 'keyrings' })
export class Keyring extends Base {
    @Column('text', {
        nullable: true,
        comment : '',
    })
    did?: string

    @Column('blob', {
        nullable: false,
        comment : '',
    })
    sign!: HexKeyPair

    @Column('blob', {
        nullable: false,
        comment : '',
    })
    update!: HexKeyPair

    @Column('blob', {
        nullable: false,
        comment : '',
    })
    recovery!: HexKeyPair

    @Column('blob', {
        nullable: false,
        comment : '',
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