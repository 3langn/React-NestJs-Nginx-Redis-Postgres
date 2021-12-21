module.exports = {
  type: 'mysql',
  replication: {
    master: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      username: 'root',
      password: 'mypass',
      database: 'mydb',
    },
    slaves: [
      {
        host: process.env.DB_READ_HOST1,
        port: 3306,
        username: 'repl',
        password: 'mypass',
        database: 'mydb',
      },
      {
        host: process.env.DB_READ_HOST2,
        port: 3306,
        username: 'repl',
        password: 'mypass',
        database: 'mydb',
      },
    ],
  },
  selector: 'RR',
  removeNodeErrorCount: 1,
  synchronize: true,
  logging: false,
  migrationsTableName: 'migrations',
  entities: ['src/entity/**/*.ts'],
  migrations: ['src/migration/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
  },
};
