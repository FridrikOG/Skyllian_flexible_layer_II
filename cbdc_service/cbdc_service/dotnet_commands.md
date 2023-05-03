# Update tables in dotnet

To create and apply migrations in a C# WebAPI project, you can use the Entity Framework Core CLI tools. Here are the steps to follow:

Open a command prompt or terminal window.

Navigate to the project directory that contains the DbContext class.

Run the following command to add the Entity Framework Core tools to your project:

### Install dotnet-ef

csharp
Copy code
dotnet tool install --global dotnet-ef
After installing the tools, run the following command to create a new migration:

### Make migrations

csharp
Copy code
dotnet ef migrations add MigrationName
Replace MigrationName with a descriptive name for the migration.

Entity Framework Core will analyze the DbContext class and generate a migration based on the changes that have been made. You can then apply the migration to the database using the following command:

### Update database

sql
Copy code
dotnet ef database update
This will apply the latest migration to the database.

That's it! You should now have a new migration applied to your database.
