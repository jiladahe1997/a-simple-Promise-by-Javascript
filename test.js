function test(){
    return new Promise(
        () =>{
        setTimeout(()=>{
            throw "exception!"
        },5000)
    }
    )
}

(function run(){
    try {
        test()
    }
    catch (e){
        console.log(e)
    }
})()