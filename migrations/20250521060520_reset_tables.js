/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  // Drop all existing tables
  await knex.schema.dropTableIfExists("contacts");
  await knex.schema.dropTableIfExists("users");

  // Create users table
  await knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("firebase_uid").notNullable().unique();
    table.string("email").notNullable().unique();
    table.string("display_name");
    table.string("photo_url");
    table.timestamps(true, true);
  });

  // Create contacts table
  await knex.schema.createTable("contacts", (table) => {
    table.increments("id").primary();
    table
      .integer("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.string("name").notNullable();
    table.string("email");
    table.string("phone");
    table.string("company");
    table.string("job_title");
    table.text("notes");
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("contacts");
  await knex.schema.dropTableIfExists("users");
};
