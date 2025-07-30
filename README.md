# NestJS: From Development to Deployed API

## Why NestJS?
It scales from small to enterprise apps.
It has clear structure which is better for maintainability.
It is great for team development.
It has a very rich ecosystem.
It has support GraphQL, WebSockets and microservices.
It has a strong community support.

Provider is anything that can be injected as a dependency.

#### Creating Module

`nest g module`

#### Creating Controller of the module.

`nest g controller tasks tasks --flat --no-spec`

#### Creating a Service

`nest g service tasks tasks --flat --no-spec`

#### Validations
`npm i --save class-validator class-transformer`

#### Mapped Types
`npm i --save @nestjs/mapped-types`

#### NestJS Config
`npm i --save @nestjs/config`

#### Validating Configuration with Joi
`npm install --save joi`

#### TypeORM Integration
`npm install --save @nestjs/typeorm typeorm pg`

#### Installing Authentication Dependencies
`npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt`
`npm install install --save-dev @types/passport-jwt @types/passport @types/bcrypt @types/jsonwebtoken`
`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

#### Unit Test
`npm run test`
`npm run test watch`

#### End-2-End Test

`npm run test:e2e`

```typescript
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({
  strategy: 'excludeAll',
})
```
```typescript
@Expose()
```

#### TypeORM Migration
`npm run migration:generate src/migrations/InitialMigration`