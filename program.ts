import "reflect-metadata";
import sequelize from "./src/infra/persistence/database/connection";
import "./src/infra/persistence/config/mysqlConfig";
import { Route } from "./src/framework/route";

sequelize.sync();
Route.Setup();
