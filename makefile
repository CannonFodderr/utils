# DEFAULT VARS
r=us-east-1
node-create-file:
	node ./js/createFile.js 
# CURL CHECK CERTIFICATE VALIDITY
curl-check-cert:
ifdef url
	curl --insecure -vvI $(url) 2>&1 | awk 'BEGIN { cert=0 } /^\* SSL connection/ { cert=1 } /^\*/ { if (cert) print }'
else
	echo "Error: URL is missing (i.e. make url=https://www.google.com curl-check-cert)"
endif
# AWS
# LIST ALL AWS REGIONS
aws-regions:
	aws ec2 describe-regions --output table
# GET EC2 INSTANCES WITH PRIVATE IP
aws-ec2-IPv4:
ifdef q
	aws ec2 describe-instances --query 'Reservations[*].Instances[*].{Instance:InstanceId,AZ:Placement.AvailabilityZone,Name:Tags[?Key==`Name`]|[0].Value, IPv4:PrivateIpAddress}' --output table --region $(r) | grep -i $(q)
else
	aws ec2 describe-instances --query 'Reservations[*].Instances[*].{Instance:InstanceId,AZ:Placement.AvailabilityZone,Name:Tags[?Key==`Name`]|[0].Value, IPv4:PrivateIpAddress}' --output table --region $(r)
endif
# GET EC2 INSTANCES FROM ALL REGIONS WITH PRIVATE IP
aws-ec2-IPv4-all-regions:
	for reg in `aws ec2 describe-regions --output text | cut -f4`; \
	do\
		echo -e "\nListing Instances in region:'$reg'..."; \
		aws ec2 describe-instances --query 'Reservations[*].Instances[*].{Instance:InstanceId,AZ:Placement.AvailabilityZone,Name:Tags[?Key==`Name`]|[0].Value, IPv4:PrivateIpAddress}' --output table; \
	done;\