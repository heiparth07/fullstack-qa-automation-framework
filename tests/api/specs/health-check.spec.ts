import { apiClient } from '../helpers/api-client';

describe('GET /api/health', () => {
  it('should return 200 with healthy status', async () => {
    const response = await apiClient.get('/health').expect(200);

    expect(response.body).toHaveProperty('status', 'healthy');
    expect(response.body).toHaveProperty('timestamp');
    expect(new Date(response.body.timestamp).getTime()).not.toBeNaN();
  });

  it('should return valid JSON content type', async () => {
    const response = await apiClient.get('/health');

    expect(response.headers['content-type']).toMatch(/application\/json/);
  });
});
