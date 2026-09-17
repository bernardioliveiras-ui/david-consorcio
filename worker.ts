import handler from 'vinext/server/app-router-entry';
import { DateTime } from 'luxon';
import { APP_ZONE } from '@/lib/time';
import { processDistributionQueue, processExpiredSlas } from '@/modules/distribution/service';

export default {
  fetch(request: Request, env: unknown, ctx: ExecutionContext) {
    return handler.fetch(request, env as never, ctx as never);
  },

  async scheduled(_controller: ScheduledController, _env: unknown, _ctx: ExecutionContext) {
    const now = DateTime.now().setZone(APP_ZONE);
    await processExpiredSlas(now);
    await processDistributionQueue(now);
  },
};
