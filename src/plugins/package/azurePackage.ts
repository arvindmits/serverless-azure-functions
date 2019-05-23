
import Serverless from 'serverless';
import AzureProvider from '../../provider/azureProvider';
import { createEventsBindings } from '../../shared/bindings';
import { getFunctionMetaData } from '../../shared/utils';

export class AzurePackage {
  provider: AzureProvider
  public hooks: { [eventName: string]: Promise<any> };

  constructor(private serverless: Serverless, private options: Serverless.Options) {
    this.hooks = {
      'package:setupProviderConfiguration': this.setupProviderConfiguration.bind(this),
    };
  }

  private async setupProviderConfiguration() {
    this.serverless.cli.log('Building Azure Events Hooks');

    const createEventsPromises = this.serverless.service.getAllFunctions()
      .map((functionName) => {
        const metaData = getFunctionMetaData(functionName, this.serverless);

        return createEventsBindings(this.serverless.config.servicePath, functionName, metaData);
      });

    return Promise.all(createEventsPromises);
  }
}