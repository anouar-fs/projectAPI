const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
var pid = urlParams.get('ID')

function GetPosts(){
    axios.get(`https://tarmeezacademy.com/api/v1/users/${pid}/posts`)
.then(function (response) {
        console.log(page)
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
                <div class="col-12 mt-5 shadow" >
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
        mybody.innerHTML+=code;
    }
    myArray.length = 0; 
    console.log(response.data);

})
.catch(function (error) {
        console.log(error);
})
.finally(function () {

});

}
GetPosts();

//      


function GetUsers(){
    axios.get(`https://tarmeezacademy.com/api/v1/users/${pid}`)
.then(function (response) {
        document.getElementById("username").innerText+=(" "+response.data.data.username);
        document.getElementById("name").innerText+=(" "+response.data.data.name);
        document.getElementById("id").innerText+=(" "+response.data.data.id);
        document.getElementById("pst_count").innerText=(" "+response.data.data.posts_count);
        document.getElementById("cmt_count").innerText=(" "+response.data.data.comments_count);
        document.getElementById("profile_picture").src=response.data.data.profile_image;
})
.catch(function (error) {
        console.log(error)
})
.finally(function () {

});
}
GetUsers()



