let aws = {
    s3: function(ev){
        
        document.getElementById("s3page").style.display="";
        
        document.getElementById("searchpage").style.display="none";
        
    },
    search:function(ev){
        document.getElementById("s3page").style.display="none";
        document.getElementById("searchpage").style.display="";
        
    },
    searchsubmit : function( ev ){
        ev.preventDefault();
        
        //console.log(username);
        //console.log(password);
        
        AWS.config.update({
            region: 'us-east-1',
        });
        
        awscs();
        
    },

    init : function(){
        var cognitoUser;
        
        //console.log(window.location.search);
        accessKeyId = window.location.search.split('?accessKeyId=')[1].split('&')[0];
        secretAccessKey = window.location.search.split('&secretAccessKey=')[1].split('&')[0];
        sessionToken = window.location.search.split('&sessionToken=')[1];
        //console.log(accessKeyId);
        //console.log(secretAccessKey);
        //console.log(sessionToken);
        
        document.getElementById("s3").addEventListener("click", aws.s3);
        document.getElementById("search").addEventListener("click", aws.search);
        document.getElementById("searchsubmit").addEventListener("click", aws.searchsubmit);
        
    }
}
aws.init();



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



function awscs(){
    
    let url = "http://search-pdftest-o4jkoj5fz62ir6p3gpck5ap22e.us-east-1.cloudsearch.amazonaws.com/2013-01-01/search?q=" + document.getElementById("searchinput").value;
    
    //let url = "http://search-test-ac-3vunghc6cpt37een4wjy7ef45e.us-east-1.cloudsearch.amazonaws.com/2013-01-01/search?q="+ document.getElementById("searchinput").value;
        
    var client = new HttpClient();
    client.get(url, function(response) {
        //console.log(response);
        var a = JSON.parse(response);
        console.log(a);
        //console.log(JSON.parse(JSON.stringify(a.hits.hit)));
        printOut(JSON.parse(JSON.stringify(a.hits.hit)));
        //document.getElementById("result").innerHTML = JSON.stringify(a.hits.hit);

    });
};


function printOut(json) {
    document.getElementById("result").innerHTML = "<h2>Search Result:</h2>"
    for (i=0;i<json.length;i++)
        {
            var fileName = JSON.stringify(json[i].fields.resourcename);
            var filePath = JSON.stringify(json[i].id);
            //document.getElementById("result").innerHTML = document.getElementById("result").innerHTML + filePath + "</br>";
            //console.log("yes");
            console.log(filePath.toString().substring(1,filePath.toString().length-1));
            console.log(fileName.toString().substring(1,fileName.toString().length-1));
            fetchURL(filePath.toString().substring(1,filePath.toString().length-1),fileName.toString().substring(1,fileName.toString().length-1));
            /*
            var object = JSON.parse(JSON.stringify(json[i].highlights));
            console.log(object);
            length = getJsonLength(object);
            console.log(length);
            for (j=0;j<length;j++)
                {
                    console.log(object[j]);
                }
                */
            //console.log(JSON.parse(JSON.stringify(json[i].highlights)));
            //document.getElementById("result").innerHTML = JSON.stringify(a.hits.hit);
        }
    return;
};

function fetchURL(filePath,fileName){
    
    AWS.config.update({
        apiVersion: "2006-03-01",
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
        sessionToken: sessionToken,
    });
    var s3 = new AWS.S3();
    var beginIndex = 0;
    var beginIndex2 = 0;
    for (var i = 0; i < filePath.length; i++) {
		var item =  filePath.charAt(i);
		if (item == '/'){
			beginIndex = i+1;
            if (beginIndex2 == 0) beginIndex2 = beginIndex;
		}
        
	}
    if (beginIndex == 0){
        document.getElementById("result").innerHTML = document.getElementById("result").innerHTML + '<p>' + filePath +'</p>'; 
    }
    else
    {
        //console.log(beginIndex);
        var bucket = filePath.substring(0,beginIndex2-1);
        var key = filePath.substring(beginIndex2,beginIndex) + fileName;
        
        console.log(bucket);
        console.log(key);
        var params = {
        Bucket: bucket, 
        Key: key,
        //ResponseContentType: "pdf",
        };
        var url = s3.getSignedUrl('getObject', params);
        console.log(url);
        var eurl = encodeURI(url);
        console.log(eurl);
        createLink(url,filePath.substring(beginIndex, filePath.length)); 
        //console.log('The URL is', url);        
    }
    return;
};
function createLink(url,Name){
    document.getElementById("result").innerHTML = document.getElementById("result").innerHTML + '<a href="' + url + '" download="' + Name + '">' + Name +'</a> </br>';
}


    
