import { Injectable, Logger } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

@Injectable()
export class SystemService {
  private readonly logger = new Logger(SystemService.name);

  async triggerUpdate() {
    this.logger.log('Update triggered via API');

    // Dispara a atualização em background (fire and forget)
    // Usamos um script externo para evitar matar o próprio processo que faz a chamada
    setTimeout(async () => {
      try {
        const { stdout, stderr } = await execAsync('cd /caminho/para/neer-data-base && ./update_zimaos.sh');
        this.logger.log(`Update output: ${stdout}`);
        if (stderr) {
          this.logger.error(`Update stderr: ${stderr}`);
        }
      } catch (error) {
         this.logger.error(`Update failed: ${error.message}`);
      }
    }, 1000);

    return {
        success: true,
        message: 'System update initiated in the background. The API will restart shortly.'
    };
  }
}
