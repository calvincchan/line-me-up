# Simple script to initialize the demo account and stations.

OWNER_EMAIL=owner@supabase.io
OWNER_PASSWORD=`openssl rand -base64 18`

supabase status --output env > __temp_env;
source __temp_env;
rm __temp_env;

# function to call the API with Curl
function call_api {
  curl -X POST -H "Apikey: $SERVICE_ROLE_KEY" -H "Authorization: Bearer $SERVICE_ROLE_KEY" -H "Content-Type: application/json" -d "$2" $1;
}

# Create the demo user account
echo "Creating demo owner account...";
call_api $API_URL/auth/v1/admin/users '{"email": "$OWNER_EMAIL","password": "$OWNER_PASSWORD","email_confirm": true}';

# Create 3 stations
echo "Creating demo stations...";
call_api $API_URL/rest/v1/station '{"name": "Station 1"}';
call_api $API_URL/rest/v1/station '{"name": "Station 2"}';
call_api $API_URL/rest/v1/station '{"name": "Station 3"}';

echo "You can now login with the following credentials:";
echo "Email: $OWNER_EMAIL";
echo "Password: $OWNER_PASSWORD";
echo "You can also find the credentials in the file credentials.txt";

# Save the credentials to a file
echo "Email: $OWNER_EMAIL" > credentials.txt;
echo "Password: $OWNER_PASSWORD" >> credentials.txt;
