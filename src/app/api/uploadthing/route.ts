import { createNextRouteHandler } from "uploadthing/next";

import type { OurFileRouter } from "./core";
import { ourFileRouter } from "./core";

export const { GET, POST } = createNextRouteHandler<OurFileRouter>({
  router: ourFileRouter,
});
