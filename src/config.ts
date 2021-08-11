import dotenv from 'dotenv'

dotenv.config()

/**
 */
class AppConfigKlass {
    /**
     * @param key 
     * @param defaultValue 
     * @returns
     */
    private config(key: string, defaultValue: string): string {
        let e: string | undefined = process.env[key]

        if (! (e)) { e = defaultValue }

        return e
    }

    /**
     */
    get ENABLE_DEBUGGING_SQL_QUERIES(): boolean {
        return ((this.config('ENABLE_DEBUGGING_SQL_QUERIES', 'false').toLowerCase()) === 'true')
    }
}

const AppConfig = new AppConfigKlass()

export { AppConfig }