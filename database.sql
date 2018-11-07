/*
 Navicat Premium Data Transfer

 Source Server         : database
 Source Server Type    : SQLite
 Source Server Version : 3012001
 Source Schema         : main

 Target Server Type    : SQLite
 Target Server Version : 3012001
 File Encoding         : 65001

 Date: 07/11/2018 15:18:21
*/

PRAGMA foreign_keys = false;

-- ----------------------------
-- Table structure for permissions
-- ----------------------------
DROP TABLE IF EXISTS "permissions";
CREATE TABLE `permissions` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `name` VARCHAR(255), `displayName` VARCHAR(255), `description` VARCHAR(255), `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL);

-- ----------------------------
-- Records of permissions
-- ----------------------------
BEGIN;
INSERT INTO "permissions" VALUES (1, 'assign-roles-to-user', 'Assign roles to user', 'N/A', '2018-11-07 19:43:03.670 +00:00', '2018-11-07 19:43:03.670 +00:00');
INSERT INTO "permissions" VALUES (2, 'remove-roles-from-user', 'Remove roles from user', 'N/A', '2018-11-07 19:43:22.622 +00:00', '2018-11-07 19:43:22.622 +00:00');
INSERT INTO "permissions" VALUES (3, 'list-users', 'List users', 'N/A', '2018-11-07 19:43:40.033 +00:00', '2018-11-07 19:43:40.033 +00:00');
INSERT INTO "permissions" VALUES (4, 'create-users', 'Create users', 'N/A', '2018-11-07 19:44:04.244 +00:00', '2018-11-07 19:44:04.244 +00:00');
INSERT INTO "permissions" VALUES (5, 'read-users', 'Read users', 'N/A', '2018-11-07 19:44:20.104 +00:00', '2018-11-07 19:44:20.104 +00:00');
INSERT INTO "permissions" VALUES (6, 'update-users', 'Update users', 'N/A', '2018-11-07 19:44:33.127 +00:00', '2018-11-07 19:44:33.127 +00:00');
INSERT INTO "permissions" VALUES (7, 'delete-users', 'Delete users', 'N/A', '2018-11-07 19:44:54.463 +00:00', '2018-11-07 19:44:54.463 +00:00');
INSERT INTO "permissions" VALUES (8, 'assign-permissions-to-role', 'Assign permissions to role', 'N/A', '2018-11-07 19:45:53.689 +00:00', '2018-11-07 19:45:53.689 +00:00');
INSERT INTO "permissions" VALUES (9, 'remove-permissions-from-role', 'Remove permissions from role', 'N/A', '2018-11-07 19:46:18.010 +00:00', '2018-11-07 19:46:18.010 +00:00');
INSERT INTO "permissions" VALUES (10, 'list-roles', 'List roles', 'N/A', '2018-11-07 19:46:32.912 +00:00', '2018-11-07 19:46:32.912 +00:00');
INSERT INTO "permissions" VALUES (11, 'create-roles', 'Create roles', 'N/A', '2018-11-07 19:46:50.116 +00:00', '2018-11-07 19:46:50.116 +00:00');
INSERT INTO "permissions" VALUES (12, 'read-roles', 'Read roles', 'N/A', '2018-11-07 19:47:06.657 +00:00', '2018-11-07 19:47:06.657 +00:00');
INSERT INTO "permissions" VALUES (13, 'update-roles', 'Update roles', 'N/A', '2018-11-07 19:47:21.108 +00:00', '2018-11-07 19:47:21.108 +00:00');
INSERT INTO "permissions" VALUES (14, 'delete-roles', 'Delete roles', 'N/A', '2018-11-07 19:47:35.900 +00:00', '2018-11-07 19:47:35.900 +00:00');
INSERT INTO "permissions" VALUES (15, 'list-permissions', 'List permissions', 'N/A', '2018-11-07 19:48:20.056 +00:00', '2018-11-07 19:48:20.056 +00:00');
INSERT INTO "permissions" VALUES (16, 'create-permissions', 'Create permissions', 'N/A', '2018-11-07 19:48:34.993 +00:00', '2018-11-07 19:48:34.993 +00:00');
INSERT INTO "permissions" VALUES (17, 'read-permissions', 'Read permissions', 'N/A', '2018-11-07 19:48:48.954 +00:00', '2018-11-07 19:48:48.954 +00:00');
INSERT INTO "permissions" VALUES (18, 'update-permissions', 'Update permissions', 'N/A', '2018-11-07 19:49:06.557 +00:00', '2018-11-07 19:49:06.557 +00:00');
INSERT INTO "permissions" VALUES (19, 'delete-permissions', 'Delete permissions', 'N/A', '2018-11-07 19:49:20.454 +00:00', '2018-11-07 19:49:20.454 +00:00');
COMMIT;

-- ----------------------------
-- Table structure for rolePermissions
-- ----------------------------
DROP TABLE IF EXISTS "rolePermissions";
CREATE TABLE `rolePermissions` (`roleId` INTEGER NOT NULL REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE, `permissionId` INTEGER NOT NULL REFERENCES `permissions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY (`roleId`, `permissionId`));

-- ----------------------------
-- Records of rolePermissions
-- ----------------------------
BEGIN;
INSERT INTO "rolePermissions" VALUES (1, 1);
INSERT INTO "rolePermissions" VALUES (1, 2);
INSERT INTO "rolePermissions" VALUES (1, 3);
INSERT INTO "rolePermissions" VALUES (1, 4);
INSERT INTO "rolePermissions" VALUES (1, 5);
INSERT INTO "rolePermissions" VALUES (1, 6);
INSERT INTO "rolePermissions" VALUES (1, 7);
INSERT INTO "rolePermissions" VALUES (1, 8);
INSERT INTO "rolePermissions" VALUES (1, 9);
INSERT INTO "rolePermissions" VALUES (1, 10);
INSERT INTO "rolePermissions" VALUES (1, 11);
INSERT INTO "rolePermissions" VALUES (1, 12);
INSERT INTO "rolePermissions" VALUES (1, 13);
INSERT INTO "rolePermissions" VALUES (1, 14);
INSERT INTO "rolePermissions" VALUES (1, 15);
INSERT INTO "rolePermissions" VALUES (1, 16);
INSERT INTO "rolePermissions" VALUES (1, 17);
INSERT INTO "rolePermissions" VALUES (1, 18);
INSERT INTO "rolePermissions" VALUES (1, 19);
COMMIT;

-- ----------------------------
-- Table structure for roles
-- ----------------------------
DROP TABLE IF EXISTS "roles";
CREATE TABLE `roles` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `name` VARCHAR(255), `displayName` VARCHAR(255), `description` VARCHAR(255), `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL);

-- ----------------------------
-- Records of roles
-- ----------------------------
BEGIN;
INSERT INTO "roles" VALUES (1, 'admin', 'The Administrator Role', 'Somebody with access to the API administration features and all other features.', '2018-11-07 19:40:58.928 +00:00', '2018-11-07 19:40:58.928 +00:00');
INSERT INTO "roles" VALUES (2, 'user', 'The User Role', 'Somebody who can only manage their profile.', '2018-11-07 19:41:35.665 +00:00', '2018-11-07 19:41:35.665 +00:00');
COMMIT;

-- ----------------------------
-- Table structure for sqlite_sequence
-- ----------------------------
DROP TABLE IF EXISTS "sqlite_sequence";
CREATE TABLE sqlite_sequence(name,seq);

-- ----------------------------
-- Records of sqlite_sequence
-- ----------------------------
BEGIN;
INSERT INTO "sqlite_sequence" VALUES ('roles', 2);
INSERT INTO "sqlite_sequence" VALUES ('permissions', 19);
INSERT INTO "sqlite_sequence" VALUES ('users', 2);
COMMIT;

-- ----------------------------
-- Table structure for userRoles
-- ----------------------------
DROP TABLE IF EXISTS "userRoles";
CREATE TABLE `userRoles` (`userId` INTEGER NOT NULL REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE, `roleId` INTEGER NOT NULL REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY (`userId`, `roleId`));

-- ----------------------------
-- Records of userRoles
-- ----------------------------
BEGIN;
INSERT INTO "userRoles" VALUES (1, 1);
INSERT INTO "userRoles" VALUES (1, 2);
INSERT INTO "userRoles" VALUES (2, 2);
COMMIT;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS "users";
CREATE TABLE `users` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `username` VARCHAR(255) UNIQUE, `email` VARCHAR(255) NOT NULL UNIQUE, `password` VARCHAR(255) NOT NULL, `confirmed` TINYINT(1) DEFAULT 0, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL);

-- ----------------------------
-- Records of users
-- ----------------------------
BEGIN;
INSERT INTO "users" VALUES (1, 'admin', 'admin333@yopmail.com', '$2b$10$EMu//Nsypyuj8c5YgKlDv.j42Dc8EpglDY37U4.zbXSUtOGA/Wws.', 0, '2018-11-07 19:55:07.390 +00:00', '2018-11-07 19:55:07.390 +00:00');
INSERT INTO "users" VALUES (2, 'edgar', 'edgar333@yopmail.com', '$2b$10$d0jGMqY/Fwzf.Dvucr3AKebZHSuAktzwi7zy4FpGGOYUw4zLARoYe', 0, '2018-11-07 19:55:41.882 +00:00', '2018-11-07 19:55:41.882 +00:00');
COMMIT;

-- ----------------------------
-- Auto increment value for permissions
-- ----------------------------
UPDATE "main"."sqlite_sequence" SET seq = 19 WHERE name = 'permissions';

-- ----------------------------
-- Auto increment value for roles
-- ----------------------------
UPDATE "main"."sqlite_sequence" SET seq = 2 WHERE name = 'roles';

-- ----------------------------
-- Auto increment value for users
-- ----------------------------
UPDATE "main"."sqlite_sequence" SET seq = 2 WHERE name = 'users';

PRAGMA foreign_keys = true;
