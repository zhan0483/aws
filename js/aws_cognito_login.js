let aws = {
    submit : function( ev ){
        ev.preventDefault();
        
        
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        
        //console.log(username);
        //console.log(password);
        
        AWS.config.update({
        region: 'us-east-1',
        });

        
        var poolData = {
            UserPoolId : 'us-east-1_w507kXoT1', // your user pool id here
            ClientId : '694uh57egmv46lbel7ebk2tmue' // your app client id here
        };
        var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
        var userData = {
            Username : username, // your username here
            Pool : userPool
        };
        
        AWSCognito.config.region = 'us-east-1';
        
        var authenticationData = {
            Username : username, // your username here
            Password : password, // your password here
            };
            
        var authenticationDetails = 
        new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);

            
        var cognitoUser = 
        new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
            
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
               
                //console.log('idToken + ' + result.idToken.jwtToken);
                //console.log('access token + ' + result.getAccessToken().getJwtToken());
                AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                    IdentityPoolId: 'us-east-1:ee22aee1-db1b-4b1a-868b-96c9385702e5',
                
                    Logins: {
                    'cognito-idp.us-east-1.amazonaws.com/us-east-1_w507kXoT1': 
             result.getIdToken().getJwtToken()
                }
                });
                
                AWS.config.credentials.get(function(){
                    // Credentials will be available when this function is called.
                    accessKeyId = AWS.config.credentials.accessKeyId;
                    secretAccessKey = AWS.config.credentials.secretAccessKey;
                    sessionToken = AWS.config.credentials.sessionToken;
                    
                    awsmain(); 
                
                });              
                
                
            },

            onFailure: function(err) {
                alert(err);
            },
            mfaRequired: function(codeDeliveryDetails) {
                var verificationCode = prompt('Please input verification code' ,'');
                cognitoUser.sendMFACode(verificationCode, this);
            }
        });
        
         
        
        
        
    },

    init : function(){
        var cognitoUser;
        document.getElementById("login").addEventListener("click", aws.submit);
    }
}
aws.init();

function awsmain(){
    var url = "../main.html?accessKeyId="+accessKeyId+"&secretAccessKey="+secretAccessKey+"&sessionToken="+sessionToken;
    //var url = "../main.html";
    //console.log(url);
    window.location.href = url;
};


function awss3(accessKeyId, secretAccessKey, sessionToken){
    //console.log(sessionToken);
    var s3 = new AWS.S3({
        apiVersion: "2006-03-01",
        sessionToken: sessionToken,
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
        
    });
    /*
    var params1 = {
        Bucket: 'testacactest', 
    };
    
    s3.listObjects(params1, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else     console.log(data);           // successful response
    });
*/
    
    var params = {
        Bucket: "testacactest", 
        Key: "upload2.pdf",
        //ResponseContentType: "pdf",
     };
    console.log(s3);
    var url = s3.getSignedUrl('getObject', params);
    //document.getElementById("result").innerHTML = '<a href="' + url + '" download="downloaddd.rtf">Download file</a>';
    console.log('The URL is', url);        

};


var HttpClient = function() {
    this.get = function(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        
        anHttpRequest.onreadystatechange = function() { 
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText);
        }

        anHttpRequest.open( "GET", aUrl, true );
        anHttpRequest.send();
    }
};



function awscs(accessKeyId, secretAccessKey, sessionToken){
    
    let url = "http://search-test-ac-3vunghc6cpt37een4wjy7ef45e.us-east-1.cloudsearch.amazonaws.com/2013-01-01/search?q=test";
        
    var client = new HttpClient();
    client.get(url, function(response) {
        //console.log(response);
        var a = JSON.parse(response);
        console.log(a);
        //console.log(JSON.parse(JSON.stringify(a.hits.hit)));
        //printOut(JSON.parse(JSON.stringify(a.hits.hit)));
        //document.getElementById("result").innerHTML = JSON.stringify(a.hits.hit);

    });
};

    
