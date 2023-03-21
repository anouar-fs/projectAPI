var already_commented=false;
var page=1;
var id;
const url = window.location.href;
let tmp=url.split('?');
var data;
var getComments;
var ID_POST;
var loading = false;
if(tmp.length>1){
    id = tmp[1].split("=")[1];
    getComments = ()=>{
        axios.get(`https://tarmeezacademy.com/api/v1/posts/${id}`)
        .then(function (response) {
            
            console.log(response.data.data.comments.length)
            console.log(response.data.data.comments) 
            
                let code =   `  <div class="container " >
                    <div class="container d-flex justify-content-center ">
                        <div class="col-8 mt-5 mb-5 shadow" >
                            <div class="card text-bg-light"  >
                                <div class="card-header">
                                    <img class="rounded-circle border border-dark-subtle" src="${response.data.data.author.profile_image}" alt="" style="width: 30px; height: 30px;">
                                    <p style=" display: none;">${response.data.data.id}</p>
                                    <b>@${response.data.data.author.username}</b></div>
                                <div class="card-body"> 
                                    <img src="${response.data.data.image}" alt="" style=" width: 100%;" >
                                    <div>
                                        <span class="text-black-50" style="font-size: 0.8em;">${response.data.data.created_at}</span> 
                                        <h5>${response.data.data.title}</h5>
                                        <p>${response.data.data.body}</p>
                                        <hr>
                                        <div class="d-flex align-items-center"><span class="material-symbols-outlined">edit</span> <a href="#" style="text-decoration: none; color: black;"> (${response.data.data.comments_count}) Comments</a> <span class="badge rounded-pill bg-secondary mx-2">Tag1</span> </div>
                                        <hr>
                                        <div id="conteneur_comments">
                                        
                                        </div>
                                        </div>
    
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;

                if(!already_commented && document.getElementById("post_body")!=null){
                    document.getElementById("post_body").innerHTML+=code;

                }
                if(already_commented){
                    document.getElementById("conteneur_comments").innerHTML="";
                }
                for(let v of response.data.data.comments){
                    
                    let code_comments =`
                    <div class="rounded-3 border border-top-0" style=" background-color:  #d4d4d440; padding: 10px 5px;">
                    <img class="rounded-circle border border-dark-subtle ml-2" src="${v.author.profile_image}" alt="" style="width: 30px; height: 30px;">
                    
                    <b>@${v.author.username}</b>
                    <br>
                    <span style="margin-left:40px; font-size: 0.9em;" >${v.body}</span>
                            </div>`;
                    if(document.getElementById("conteneur_comments")!=null){
                        document.getElementById("conteneur_comments").innerHTML+=code_comments;
                    }
                    }
                    if(document.getElementById("conteneur_comments")!=null){
                        
                        document.getElementById("conteneur_comments").innerHTML+=`
                        <div class="input-group mb-3">
                        <input id="thecomment" type="text" class="form-control" placeholder="Recipient's username" aria-label="Recipient's username" aria-describedby="button-addon2"> 
                        <button class="btn btn-outline-secondary" type="button" id="button-addon2" onclick="addComment()" >Add </button> 
                        </div>
                        `
                    }
                    already_commented=true;
                }
        )
    
    }
    getComments();
    }

let addComment = ()=>{
    data = {
        body: document.getElementById("thecomment").value,
    }
    axios.post(`https://tarmeezacademy.com/api/v1/posts/${id}/comments`,data,{
                headers: {
                    Authorization: 'Bearer '+localStorage.getItem("Token"),
                },
            })
    .then(function (response) {
            console.log("done!!!!")
        })
    .catch(function (error) {
            console.log(error)
        })
    .finally(function () {
        document.getElementById("thecomment").value="";
        getComments();
        });
}



let setui = ()=>{
    if(localStorage.getItem("Token")!=null){
        document.getElementById("lgin").style.display='none';
        document.getElementById("signin").style.display='none';
        document.getElementById("logout").style.display='block';
        if(document.getElementById("plus_button")!=null){
        document.getElementById("plus_button").style.display='block';}
        document.getElementById("prf").innerHTML+=`<img class="rounded-circle " src="${JSON.parse(localStorage.getItem("User")).profile_image}" alt="" style="width: 40px; height: 40px; margin-right: 5px;"></img>`
        document.getElementById("prf").innerHTML+=`<b>@${JSON.parse(localStorage.getItem("User")).username}</b>`
        
    }
    // else{

    // }
}
setui();
function login(user,pass){

    axios.post(`https://tarmeezacademy.com/api/v1/login?username=${user}&password=${pass}`)
.then(function (response) {
        localStorage.setItem("Token",response.data.token);
        localStorage.setItem("User",JSON.stringify(response.data.user))
        document.getElementById("close").click();
        document.getElementById("alert").style.display="block";
        
        setui();
        let mybody = document.getElementById("the_body");
        if(mybody!=null){
            mybody.innerHTML="";
        }
        if(document.getElementById("update")==null){
            GetPosts(page-1);
        }
    })
.catch(function (error) {
        // en cas d’échec de la requête
        console.log(error);
    })
.finally(function () {

        // let tab = document.querySelectorAll('#cd_header');
        // for(let vr of tab){
        //     console.log(vr.children)    
        // }
        setTimeout(() => {
            document.getElementById("alert").style.display="none";
        }, 4000);
        
    });
}
    



function GetPosts(page){
    axios.get(`https://tarmeezacademy.com/api/v1/posts?limit=5&page=${page}`)
.then(function (response) {
        console.log(page)
        
        document.getElementById("loader").style.display="block";
        
        for (let elm of response.data.data){
            let tmp ={
                username:`${elm.author.username}`,
                comments_count:`${elm.comments_count}`,
                created_at:`${elm.created_at}`,
                body:`${elm.body}`,
                title:`${elm.title}`,
                image:`${elm.image}`,
                profile_image:`${elm.author.profile_image}`,
                id:`${elm.id}`,
                user_id:`${elm.author.id}`
            }
            myArray.push(tmp) 
        }
        var magic ="none";
        for(let el of myArray){
            if(localStorage.getItem("User")!=null){
                if(el.user_id == JSON.parse(localStorage.getItem("User")).id ){
                    // JSON.parse(localStorage.getItem("User")).username
                    magic="block";
                }else{
                    magic ="none"
                }
            }
            let code =   `  <div class="container" >
            <div class="container d-flex justify-content-center ">
                <div class="col-8 mb-5 shadow" >
                    <div id="cont_post" class="card text-bg-light" style="cursor: pointer;" >
                        <div class="card-header" id="cd_header">
                            <p id="user_id" style="display:none">${el.user_id}</p>
                            <img class="rounded-circle border border-dark-subtle" src="${el.profile_image}" alt="" style="width: 30px; height: 30px;">
                            <p id="getID" style=" display: none;">${el.id}</p>
                            <p id="edit" style=" display: none;"></p>
                            <b onclick="(any_profil(${el.user_id}))">@${el.username}</b> <button style=" margin-left:10px; display: ${magic}; float:right;" type="button" class="btn btn-danger" onclick="printer(${el.id})">Delete</button> <button style="display: ${magic}; float:right;" type="button" class="btn btn-secondary" onclick="EditPost(['${el.title}','${el.body}','${el.id}'])">Edit</button> </div>
                        <div class="card-body" onclick="view_comments(${el.id})"> 
                            <img src="${el.image}" alt="" style=" width: 100%;" >
                            <div onclick="view_comments(${el.id})">
                                <span class="text-black-50" style="font-size: 0.8em;">${el.created_at}</span> 
                                <h5>${el.title}</h5>
                                <p>${el.body}</p>
                                <hr>
                                <div class="d-flex align-items-center"><span class="material-symbols-outlined">edit</span> <a href="#" style="text-decoration: none; color: black;"> (${el.comments_count}) Comments</a> <span class="badge rounded-pill bg-secondary mx-2">Tag1</span> </div>
                            </div>
                        </div>
                    </div>
                </div> 
            </div>
        </div>`;
        
        let mybody = document.getElementById("the_body");
        if(mybody!=null){
            mybody.innerHTML+=code
        }
    }
    myArray.length = 0; 
    console.log(response.data);
    loading=true;

})
.catch(function (error) {
        console.log(error);
})
.finally(function () {
    setTimeout(() => {
        document.getElementById("loader").style.display="none";
    }, 1000);
});

}
var myArray=[];

if(document.getElementById("update")==null){
    GetPosts(page);
}


function func(){
    let form=document.getElementById("myform");
    let user=form.elements.Email_inp.value
    let pass=form.elements.Password.value
    login(user,pass)
}

///////////////////******************  LOG OUT ******************//////////////////////////

let clk =()=>{
    document.getElementById("lgin").style.display='block';
    document.getElementById("signin").style.display='block';
    document.getElementById("logout").style.display='none';
    document.getElementById("plus_button").style.display='none';
    document.getElementById("alert2").style.display='block';
    document.getElementById("prf").innerHTML="";
    setTimeout(() => {
        document.getElementById("alert2").style.display='none';
    }, 3000);
    window.localStorage.clear();
    location.reload();
}


// axios.post('/api/endpoint', {
//     param1: 'value1',
//     param2: 'value2',
//   }, {
//     headers: {
//       Authorization: 'Bearer ' + token,
//       'Content-Type': 'application/json',
//     },
//   })


let addpost = ()=>{
        let check = document.getElementById("edit").innerText;
        document.getElementById("edit").innerText="";

        let header = document.getElementById("recipient_name");
        let body = document.getElementById("message_text");
        const fileInput = document.getElementById('formFile');
        const formData = new FormData();
        formData.append('body', `${body.value}`);
        formData.append('title', `${header.value}`);
        formData.append('image', fileInput.files[0]);
        if(check=="OK"){
            formData.append("_method","put");
            axios.post(`https://tarmeezacademy.com/api/v1/posts/${ID_POST}`,formData ,{
                    headers: {
                        Authorization: 'Bearer '+localStorage.getItem("Token"),
                        'Content-Type': 'multipart/form-data'
                    },
                })
            .then(function (response) {
                
                // console.log("post have been edited")
                //setui();
                document.getElementById("closebtn").click();
                document.getElementById("success").click();
                setTimeout(() => {
                    location.reload();
                }, 3000);
                console.log(response);
                })
            .catch(function (error) {
                // en cas d’échec de la requête
                console.log(error);
            })
            .finally(function () {
            });
        }else{
            axios.post(`https://tarmeezacademy.com/api/v1/posts`,formData ,{
                    headers: {
                        Authorization: 'Bearer '+localStorage.getItem("Token"),
                        'Content-Type': 'multipart/form-data'
                    },
                })
            .then(function (response) {
                console.log("post have been added")
                //setui();
                document.getElementById("closebtn").click();
                document.getElementById("success").click();
                setTimeout(() => {
                    location.reload();
                }, 3000);
                })
            .catch(function (error) {
                // en cas d’échec de la requête
                console.log(error);
            })
            .finally(function () {
                setTimeout(() => {
                    //document.getElementById("alert").style.display="none";
                }, 4000);
            });
        }
        

        
    }
let addinpost=()=>{
    let v = addpost();
}

window.addEventListener('scroll', function() {
    // console.log(window.pageYOffset)
    // console.log(document.body.offsetHeight)

    if ((window.innerHeight + window.pageYOffset) >= document.body.scrollHeight) {
      // User has scrolled to the end of the page
        page=page+1;
        console.log(page)
        
        if(document.getElementById("update")==null){
                
                GetPosts(page);
        }

    }

});

var TheLoading=()=>{
    document.getElementById("the_body").innerHTML+=`
                <div class="card" aria-hidden="true">
                <img src="..." class="card-img-top" alt="...">
                <div class="card-body"> 
                <h5 class="card-title placeholder-glow">
                    <span class="placeholder col-6"></span>
                </h5>
                <p class="card-text placeholder-glow">
                    <span class="placeholder col-7"></span>
                    <span class="placeholder col-4"></span>
                    <span class="placeholder col-4"></span>
                    <span class="placeholder col-6"></span>
                    <span class="placeholder col-8"></span>
                </p>
                    <a href="#" tabindex="-1" class="btn btn-primary disabled placeholder col-6"></a>
                    </div>
                </div>
            `;
}

let view_comments = (id_pass)=>{
    if(localStorage.getItem("Token")!=null){
        window.location.href = `http://127.0.0.1:5555/post.html?id=${id_pass}`;
    }else{
        document.getElementById("lgin").click();
    }
    
}

let hello=()=>{
    console.log("hello everyone ")
}
let EditPost = (params)=>{
    console.log("yup it's clicked")
    let postModal = new bootstrap.Modal(document.getElementById("exampleModal2"),{})
    postModal.toggle()
    document.getElementById("post_title").innerText="Update your Post"
    document.getElementById("picture").innerText="Change The image of the post:"
    document.getElementById("recipient_name").value=params[0];
    document.getElementById("message_text").value=params[1];
    document.getElementById("edit_button").innerText="Update comment";
    document.getElementById("edit").innerText="OK";
    ID_POST=params[2];
    
};
if(document.getElementById("plus_button")!=null){
    document.getElementById("plus_button").addEventListener("click",()=>{
        document.getElementById("post_title").innerText="New Post"
        document.getElementById("picture").innerText="Select the image for your post:"
    })
}
let printer=(id)=>{
    let postModal = new bootstrap.Modal(document.getElementById("staticBackdrop"),{})
    postModal.toggle()
    ID_POST=id;
}

let Delete_Post=()=>{
    let postModal = new bootstrap.Modal(document.getElementById("exampleModal5"),{})

    axios.delete(`https://tarmeezacademy.com/api/v1/posts/${ID_POST}`,{
            headers: {
                Authorization: 'Bearer '+localStorage.getItem("Token"),
                'Content-Type': 'multipart/form-data'
            },
        })
    .then(function (response) {
        let postModal = new bootstrap.Modal(document.getElementById("exampleModal5"),{})
        postModal.toggle()
    //setui();
        document.getElementById("closing").click();
        postModal.toggle()
        setTimeout(() => {
            location.reload();
        }, 3000);
        console.log(response);
        })
    .catch(function (error) {
        // en cas d’échec de la requête
        console.log(error);
    })
    .finally(function () {
    });
}

let any_profil=(id)=>{
    // location.href("http://127.0.0.1:5555/profile.html");    
    window.location.replace(`http://127.0.0.1:5555/profile.html?ID=${id}`);
}

let my_profil=()=>{
    window.location.replace(`http://127.0.0.1:5555/profile.html?ID=${JSON.parse(localStorage.getItem("User")).id}`);
}