import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import path from 'path';
import fs from 'fs';

async function bootstrap() {
    const ssl = process.env.SSL === 'true' ? true : false;
    let httpsOptions = null;
    if (ssl) {
        const keyPath = process.env.SSL_KEY_PATH || '';
        const certPath = process.env.SSL_CERT_PATH || '';
        httpsOptions = {
            key: fs.readFileSync(path.join(__dirname, keyPath)),
            cert: fs.readFileSync(path.join(__dirname, certPath)),
        };
    }
    const app = await NestFactory.create(AppModule, { httpsOptions });
    const globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);
    const port = Number(process.env.PORT) || 3000;
    const hostname = process.env.HOSTNAME || 'localhost';
    await app.listen(port, hostname, () => {
        const address = 'http' + (ssl ? 's' : '') + '://' + hostname + ':' + port + '/';
        Logger.log(`🚀 Application is running on: ${address}`);
    });
}

bootstrap();
