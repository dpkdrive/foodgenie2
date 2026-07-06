import axios from 'axios'

const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID!
const SALT_KEY    = process.env.PHONEPE_SALT_KEY!
const SALT_INDEX  = process.env.PHONEPE_SALT_INDEX ?? '1'

async function getToken(): Promise<string> {
  const body = new URLSearchParams({
    client_id:      MERCHANT_ID,
    client_secret:  SALT_KEY,
    client_version: SALT_INDEX,
    grant_type:     'client_credentials',
  }).toString()

  const res = await axios.post(
    'https://api.phonepe.com/apis/identity-manager/v1/oauth/token',
    body,
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  )

  return res.data.access_token
}

export async function initiatePayment(opts: {
  transactionId: string
  amountRupees:  number
  redirectUrl:   string
  callbackUrl:   string
  mobile?:       string
}) {
  const token = await getToken()

  const body = {
    merchantOrderId: opts.transactionId,
    amount:          Math.round(opts.amountRupees * 100),
    expireAfter:     1200,
    metaInfo:        {},
    paymentFlow: {
      type:         'PG_CHECKOUT',
      merchantUrls: { redirectUrl: opts.redirectUrl },
    },
  }

  const res = await axios.post(
    'https://api.phonepe.com/apis/pg/checkout/v2/pay',
    body,
    { headers: { 'Content-Type': 'application/json', Authorization: `O-Bearer ${token}` } }
  )

  const redirectUrl = res.data?.redirectUrl
  if (!redirectUrl) throw new Error('No redirect URL from PhonePe')

  return { redirectUrl }
}

export async function verifyPayment(transactionId: string) {
  const token = await getToken()

  const res = await axios.get(
    `https://api.phonepe.com/apis/pg/checkout/v2/order/${transactionId}/status`,
    { headers: { 'Content-Type': 'application/json', Authorization: `O-Bearer ${token}` } }
  )

  return res.data
}
