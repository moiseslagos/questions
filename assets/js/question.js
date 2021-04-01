console.log("question");
var objQuestion = {
    
    renderTime: ()=>{
        const renderTime = document.getElementsByClassName('render-time');
        const timeStamp = renderTime[0].getAttribute('data-timeseconds');
    }
}