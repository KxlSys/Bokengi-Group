// Any setup scripts you might need go here

// Load .env files
import 'dotenv/config'

process.env.PAYLOAD_SECRET =
  process.env.PAYLOAD_SECRET || 'bokengi-group-dev-test-secret-32chars-min'
