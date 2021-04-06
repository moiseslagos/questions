console.log("question");
const objQuestion = {
    duration:0,
    startPagination:0,
    cuestions:[],
    btnPrevious: document.getElementById('btn-previous'),
    btnNext: document.getElementById('btn-next'),
    timerText: document.getElementById('timer-text'),
    timerBg: document.getElementById('timer-bg'),
    paginationAll: document.getElementById('pagination_all'),
    init: ()=>{
        objQuestion.duration = objQuestion.timerText.getAttribute('data-timeseconds');

        objQuestion.loadAllQuestions();
    },
    sendFormulario:()=>{
        //enviar formulario => objQuestion.cuestions;
        console.log(objQuestion.cuestions);
    },
    cancelModal:()=>{
        document.getElementById('modal').style.display = 'none';
    },
    loadAllQuestions: ()=>{
        let all_question;
        fetch('questions.json')
            .then(response => response.json())
            .then(
                (data) => {
                    objQuestion.cuestions = data;
                    document.getElementById('name_examen').innerText = data.name_examen;
                    objQuestion.paginationAll.innerText = objQuestion.startPagination+1 + "/"+data.questions_total;

                    all_question = data.all_question;

                    //start 0
                    objQuestion.loadQuestion( data.all_question[0] );
                    objQuestion.btnPrevious.disabled = true;

                    objQuestion.btnNext.addEventListener( 'click', ()=>{
                        if( objQuestion.startPagination < data.questions_total-1 ){
                            objQuestion.validateInput(objQuestion.startPagination);

                            objQuestion.startPagination = objQuestion.startPagination+1;

                            objQuestion.btnPrevious.disabled = false;
                            objQuestion.loadQuestion( objQuestion.cuestions.all_question[objQuestion.startPagination] );                                                        
                            objQuestion.paginationAll.innerText = objQuestion.startPagination+1 + "/"+data.questions_total;

                            
                        }else{
                            //console.log("enviar formulario");
                            document.getElementById('modal').style.display = 'block';
                            return;
                        }
                        if( objQuestion.startPagination === data.questions_total-1 ){
                            //console.log("change texto");
                            objQuestion.btnNext.innerText = 'Enviar examen';
                        }
                       
                    });

                    objQuestion.btnPrevious.addEventListener( 'click', ()=>{
                        if( objQuestion.startPagination > 0 ){
                            objQuestion.btnNext.innerText = 'Siguiente';
                            objQuestion.startPagination = objQuestion.startPagination-1;
                            objQuestion.loadQuestion( objQuestion.cuestions.all_question[objQuestion.startPagination] );

                            objQuestion.paginationAll.innerText = objQuestion.startPagination+1 + "/"+data.questions_total;

                        }else{
                            objQuestion.btnPrevious.disabled = true;
                        }
                       
                    });
                }
            )
            .catch(function(err) {
                console.error(err);
            });
    },
    validateInput: (pag)=>{
        
        const inputs = document.getElementsByTagName('input');
        for(let i=0; i < inputs.length; i++){
            if( inputs[i].checked ){
                objQuestion.cuestions['all_question'][pag]['answers'][i].checked = true;
                objQuestion.cuestions['all_question'][pag].checked = true;
            }
        }
        //console.log(objQuestion.cuestions);

    },
    loadQuestion: ( question )=>{
        const { answers, id, checked } = question;
        const renderOptions = document.getElementById('renderOptions');
        renderOptions.innerHTML = "";

        document.getElementById('question_title').innerText = question.title;

        const options = document.querySelector('#option');
        const input = options.content.querySelectorAll("input");
        const label = options.content.querySelectorAll("label");

        for( let i=0; i < answers.length; i++ ){

            if(checked){
                input[0].disabled = true;
                objQuestion.paginationAll.classList.add('bg-green-500');
                objQuestion.paginationAll.classList.remove('bg-indigo-500');
            }else{
                input[0].disabled = false;
                objQuestion.paginationAll.classList.add('bg-indigo-500');
                objQuestion.paginationAll.classList.remove('bg-green-500');
            }
            input[0].setAttribute("id", id+"-"+i);
            input[0].setAttribute("name", id);
            
            if(answers[i].checked){
                input[0].checked = true;
                //console.log(answers[i]);
            }else{ input[0].checked = false }

            label[0].textContent = answers[i].name;
            label[0].setAttribute("for", id+"-"+i);

            

            var clone = document.importNode(options.content, true);
            renderOptions.appendChild(clone);
        }
    },
    startTimer: (endTimer) => {
        var timer = objQuestion.duration, minutes, seconds;
        var setIntervalTimer;
        setIntervalTimer = setInterval(function () {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);
    
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
    
            //console.log(minutes + ":" + seconds);
            
            objQuestion.timerText.innerText = minutes + ":" + seconds;

            if (--timer < 0) {
                //console.log("timer end");
                objQuestion.timerBg.classList.add('bg-red-100', 'text-red-800');
                objQuestion.timerBg.classList.remove('bg-green-100', 'text-green-800');
                endTimer();
                clearInterval(setIntervalTimer);
            }
        }, 1000);
    }

}

objQuestion.init();

objQuestion.startTimer( function(){
    console.log("terminó el tiempo!")
});