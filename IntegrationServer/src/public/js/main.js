port = 3003;
var socket = io.connect(`http://localhost:${port}`, {'forceNew': true});

socket.on('newVariables', function (data) {
    // console.log("newVariables");
    // console.log(data);
    if(data){
        renderVariables(data);
    }
});
 
socket.on('modified-resourse', function (data) {
    // console.log(data);
    renderResources(data);
});

async function renderResources(data){
    if(data.newOpcs){
        var newHtml = await data.newOpcs.map((resource) => {
            return(`
            <div class="col-md-6 mt-2">
                    <div class="card shadow rounded">
                        <div class="card-body">
                            <h4 class="card-title d-flex justify-content-between align-items-center">
                                <i class="fa fa-cogs" aria-hidden="true"></i> 
                                <a alt="Edit" class="link-light" href="/resources/opc/${resource._id}/monitor">OPC - ${resource.name} (${resource.methods ? Object.keys(resource.methods[0]).length  : 0}) </a> 
                                <a alt="Edit" class="link-light" href="/resources/opc/${resource._id}"><i class="fas fa-edit"></i></a>
                            </h4>
                            <p>${resource.url}</p>
                            <p>${resource.state}</p>
                            <h4 class="card-title d-flex justify-content-between align-items-center">

                            <form action="/resources/opc/${resource._id}?_method=DELETE" method="POST">
                                <input type="hidden" name="_method" value="DELETE">
                                <button class="btn btn-danger btn-sm" type="submit"><i class="fas fa-trash-alt"></i> 
                            </form> 

                            </button> <i class="fas fa-circle ${resource.state}"></i>
                            </h4>
                        </div>
                    </div>
            </div>`
            );
        }).join(" ");
    }

    if(document.getElementById('resources_container')){
        document.getElementById('resources_container').innerHTML= newHtml;
    }
}





async function renderVariables(data){
    let obj = Object.keys(data.methods);
    console.log(obj)
    var newHtml = await obj.map((key, index) =>{
          return(
            `
                <tr>
                    <th scope="row">${index}</th>
                    <td>${key}</td>
                    <td>${data.methods[key]}</td>
                </tr>
            `
          )
    }).join(" ");

        // console.log(newHtml);
        if(document.getElementById('resource_variables')){
            document.getElementById('resource_variables').innerHTML= newHtml;
        }
}


function monitorOpc (id){

    socket.emit("monitorOpc", id);
}