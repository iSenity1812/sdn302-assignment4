import "reflect-metadata";
import { createApp } from "../src/app";
import type { Application } from "express";

let app: Application | undefined;

export default async (req: any, res: any) => {
  if (!app) {
    app = await createApp();
  }
  return app(req, res);
};
