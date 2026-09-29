"use client";

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

const SINGLETONS = new Set(["siteSettings"]);

export default defineConfig({
  name: "heima-creative",
  title: "HEIMA.CREATIVE CMS",
  basePath: "/studio",
  projectId: projectId || "placeholder",
  dataset: dataset || "production",
  schema: {
    types: schemaTypes,
    // Singleton tidak bisa dibuat ulang dari menu "Create"
    templates: (templates) => templates.filter(({ schemaType }) => !SINGLETONS.has(schemaType)),
  },
  document: {
    actions: (actions, { schemaType }) =>
      SINGLETONS.has(schemaType) ? actions.filter(({ action }) => action && ["publish", "discardChanges", "restore"].includes(action)) : actions,
  },
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
});
