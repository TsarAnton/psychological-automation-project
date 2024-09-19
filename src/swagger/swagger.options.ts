import { DocumentBuilder } from "@nestjs/swagger";

export const swaggerConfig = new DocumentBuilder()
    .setTitle('Psychologic Automation Project API')
    .addBearerAuth(
        {
            description: 'Enter JWT token',
            type: 'http',
            in: 'header',
            scheme: 'bearer',
            bearerFormat: 'JWT',
        },
        'JWT authorization',
    )
    .build();