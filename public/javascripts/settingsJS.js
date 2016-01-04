function FillDatabase(whatToFill){
    $.ajax({
        url: whatToFill + '/write/fillDB',
        type: 'PUT'
    });
}

function SimulateMatchday(){
    $.ajax({
        url: 'games/simulate',
        type: 'PUT'
    });
}

function DeleteCollection(whatToDelete)
{
    $.ajax({
        url: whatToDelete + "",
        type: 'DELETE'
    });
}

