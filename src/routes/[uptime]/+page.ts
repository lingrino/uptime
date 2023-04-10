import type { PageLoad } from "./$types.js";

export const load = (({ params }) => {
  const uptime = Number(params.uptime.replace(/^\/+/g, ""));

  if (Number.isNaN(uptime) || uptime < 0 || uptime > 100) {
    return {
      uptime: 99.9,
    };
  }

  return {
    uptime: params.uptime,
  };
}) satisfies PageLoad;
