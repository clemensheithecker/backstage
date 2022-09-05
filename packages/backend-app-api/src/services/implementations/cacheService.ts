/*
 * Copyright 2022 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { CacheManager } from '@backstage/backend-common';
import {
  configServiceRef,
  createServiceFactory,
  cacheServiceRef,
  loggerServiceRef,
  loggerToWinstonLogger,
} from '@backstage/backend-plugin-api';

/** @public */
export const cacheFactory = createServiceFactory({
  service: cacheServiceRef,
  deps: {
    configFactory: configServiceRef,
    loggerFactory: loggerServiceRef,
  },
  factory: async ({ configFactory, loggerFactory }) => {
    const config = await configFactory('root');
    const config2 = await configFactory();
    const config3 = await configFactory(ROOT_PLUGIN_ID);

    const cacheManager = CacheManager.fromConfig(config, {
      logger: loggerToWinstonLogger(await loggerFactory('root')),
    });
    return async (pluginId: string) => {
      return cacheManager.forPlugin(pluginId, {
        logger: loggerToWinstonLogger(await loggerFactory(pluginId)),
      });
    };
  },
});
