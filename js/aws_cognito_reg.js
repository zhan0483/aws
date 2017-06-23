let aws = {
    passcheck : function( ev ){
        ev.preventDefault();
        if (document.getElementById('password').value == document.getElementById('password2').value){ 
            aws.submit();
        }
        else {alert('Please Check Password')};
        
    },
    
    submit : function( ev ){

        
        var username = document.getElementById('username').value;
        var givenname = document.getElementById('givenname').value;
        var email = document.getElementById('email').value;
        var phone_number = document.getElementById('phone_number').value;
        var password = document.getElementById('password').value;
        //console.log(username);
        //console.log(email);
        //console.log(phone_number);
        //console.log(password);
        /*
        AWS.config.region = 'us-east-1'; // Region
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: 'us-east-1:9570852e-c484-4b2e-8489-69c4b4ccfea9',
        });
        */
        
        AWSCognito.config.region = 'us-east-1';
        
        var poolData = {
            UserPoolId : 'us-east-1_w507kXoT1', // your user pool id here
            ClientId : '694uh57egmv46lbel7ebk2tmue' // your app client id here
        };
        var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
        var userData = {
            Username : username, // your username here
            Pool : userPool
        };
        
        var attributeList = [];
 
        var dataEmail = {
            Name : 'email',
            Value : email // your email here
        };
        var dataGivenName = {
            Name : 'given_name',
            Value : givenname // your phone number here with +country code and no delimiters in front
        };
        var dataPhoneNumber = {
            Name : 'phone_number',
            Value : phone_number // your phone number here with +country code and no delimiters in front
        };
        var attributeGivenName = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataGivenName);
        var attributeEmail = 
        new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataEmail);
        var attributePhoneNumber = 
        new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataPhoneNumber);

        attributeList.push(attributeGivenName);
        attributeList.push(attributeEmail);
        attributeList.push(attributePhoneNumber);

        
        userPool.signUp(username, password, attributeList, null, function(err, result){
            if (err) {
                alert(err);
                return;
            }
            cognitoUser = result.user;
            document.getElementById("info1").style.display="none";
            document.getElementById("info2").style.display="";
            console.log('user name is ' + cognitoUser.getUsername());
        });
    },
    
    submit2 : function(ev){
        var confirm_registration = document.getElementById('confirmRegistration').value;
        if (confirm_registration == '') alert("Please type in the confirmation code!");
        cognitoUser.confirmRegistration(confirm_registration, true, function(err, result) {
        
            if (err) {
                alert(err);
                return;
            }
            else{
                alert("Success!");
                window.location.href='../login.html';
            }
            //console.log('call result: ' + result);
        })


    },

    init : function(){
        var cognitoUser;
        document.getElementById("submit").addEventListener("click", aws.passcheck);
        document.getElementById("submit2").addEventListener("click", aws.submit2);
    }
}
aws.init();