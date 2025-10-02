import { createRouteHandler } from "uploadthing/next";

import type { OurFileRouter } from "./core";
import { ourFileRouter } from "./core";

export const { GET, POST } = createRouteHandler<OurFileRouter>({
  router: ourFileRouter,
});
