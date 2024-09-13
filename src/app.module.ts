import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { StudentModule } from './student/student.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    StudentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
