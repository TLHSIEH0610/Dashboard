export async function UserLogin(Account) {
    let Account_JSON = JSON.stringify(Account)
    let url = `/login?user=${Account_JSON}`
    let response
    let data
    
    // axios.get(url).then((res)=>{return res}) 用axios會反回undefined ??

    try{
        response = await fetch(url, { credentials: 'include' })
        data = await response.json();
        return [response,data.response]
    }
    catch(error){
        console.log('error: ', error);
        return [response,data]
    }
}


export async function UserLogOut() {
    const url = "/logout"
    let response
    try{
        response = await fetch(url, { credentials: 'include', method:'POST' })
        console.log(response)
        localStorage.removeItem("authUser.name")
        localStorage.removeItem("authUser.cid")
        localStorage.removeItem("authUser.level")
        localStorage.removeItem("auth.isAuthed")
        return response
    }
    catch(error){
        console.log('error: ', error);
        response = error
        return response
    }
}



