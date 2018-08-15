import { BugReporterModule } from './bug-reporter.module';

describe('BugReporterModule', () => {
  let bugReporterModule: BugReporterModule;

  beforeEach(() => {
    bugReporterModule = new BugReporterModule();
  });

  it('should create an instance', () => {
    expect(bugReporterModule).toBeTruthy();
  });
});
