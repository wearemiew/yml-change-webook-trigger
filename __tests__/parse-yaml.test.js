const parseYaml = require('../src/parse-yaml');
const fs = require('fs');

// Mock fs.readFileSync
jest.mock('fs');

describe('parseYaml', () => {
  describe('extractWebhooks', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('should extract webhook URLs from valid YML', () => {
      // Mock file content
      const mockYmlContent = `
service: test-service
config:
  timeout: 30
  retries: 3
x-update-webhooks:
  - https://example.com/webhook1
  - https://api.service.com/notify
  - not-a-valid-url
  - https://webhook.site/123456
      `;
      
      fs.readFileSync.mockReturnValue(mockYmlContent);
      
      const webhooks = parseYaml.extractWebhooks('test-file.yml');
      
      expect(webhooks).toHaveLength(3);
      expect(webhooks).toContain('https://example.com/webhook1');
      expect(webhooks).toContain('https://api.service.com/notify');
      expect(webhooks).toContain('https://webhook.site/123456');
      expect(webhooks).not.toContain('not-a-valid-url');
    });
    
    test('should return empty array for YML without webhooks', () => {
      const mockYmlContent = `
service: test-service
config:
  timeout: 30
  retries: 3
      `;
      
      fs.readFileSync.mockReturnValue(mockYmlContent);
      
      const webhooks = parseYaml.extractWebhooks('test-file.yml');
      
      expect(webhooks).toHaveLength(0);
    });
    
    test('should handle invalid YML gracefully', () => {
      const mockInvalidYmlContent = `
service: test-service
  invalid-indentation
      `;
      
      fs.readFileSync.mockReturnValue(mockInvalidYmlContent);
      
      const webhooks = parseYaml.extractWebhooks('test-file.yml');
      
      expect(webhooks).toHaveLength(0);
    });
  });
});
