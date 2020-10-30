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
        const cid = localStorage.getItem('authUser.cid')
        if(!cid){return}
        response = await fetch(url, { credentials: 'include' })
        console.log(response)
        localStorage.clear()
        return response
    }
    catch(error){
        console.log('error: ', error);
        response = error
        return response
    }
}