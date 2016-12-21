var dateHelper = require('./date');

// generate table data for tag table "/servers-edit-tags"
function generateTagTable(tagData, colCount)
{
    var tableData = "";
    
    var rowCount = Math.ceil(tagData.length / colCount);

    for (var row=0, tagCounter=0; row<rowCount; row++)
    {
        tableData += "<tr>";

        for (var col=0; col<colCount; col++)
        {
            if (tagCounter < tagData.length)
            {
                tableData += '<td><span onClick=\'addTag(\"'+tagData[tagCounter].tag+'\")\' style="cursor:pointer;font-weight:700; color:#'+tagData[tagCounter].color+'">'+tagData[tagCounter].tag+'</span></td>';
                tagCounter++;
            }
            else
            {
                tableData += '<td></td>';
            }    
        }

        tableData += "</tr>";
    }  

    var tableHeader = "";

    for(var i=0; i<colCount; i++)
    {
        tableHeader += '<th>col '+i+'</th>';
    }

    var tableContent = "";

    tableContent =
    'Click tag to add it to input field.'+     
    '<table id="tag-table" class="table table-bordered data-table">'+
        '<thead>'+
        '<tr>'+
        tableHeader+
        '</tr>'+
        '</thead>'+
        '<tbody>'+
        tableData+
        '</tbody>'+
    '</table>';
    
    return tableContent;
}

// convert tag to html span with tag color
function tagsToHTML(tagsData)
{
    var tagsHtml = {};

    for (var item = 0; item<tagsData.length; item++)
    {
        tagsHtml[tagsData[item].tag] = '<span style="font-weight:700; color:#'+tagsData[item].color+';">'+tagsData[item].tag+'</span>';
    }

    return tagsHtml;
}

// generate tag string at servers list table
function FormatTagStr(serversData, tagsData, counter)
{
    var tagsHtml = tagsToHTML(tagsData);

    var tagStr;

    if (serversData[counter].tags != null)
    {
        var tagsArr = serversData[counter].tags.split(' ');
        tagStr = [];

        for (var t=0; t<tagsArr.length; t++)
        {
            tagStr.push(tagsHtml[tagsArr[t]]);
        }

        tagStr = tagStr.join(' ');
    }
    else
    {
        tagStr = "";
    }  

    return tagStr;
}

//generate server list table content
function generateServerTable(data)
{
    var tableData = "";

    var tagsData = data.tags;
    var serversData = data.servers;

    var state = {};
    state['online'] = '<span class="label label-success">&nbsp;&nbsp;online&nbsp;&nbsp;</span>';
    state['offline'] = '<span class="label label-inverse">&nbsp;&nbsp;offline&nbsp;&nbsp;</span>';
    state['reply'] = '<span class="label label-info">&nbsp;&nbsp;reply&nbsp;&nbsp;</span>';

    var is_paused = {};
    is_paused[0] = '<span class="label">&nbsp;working&nbsp;</span>';
    is_paused[1] = '<span class="label label-important">&nbsp;paused&nbsp;</span>';   

    for(var i=0; i<serversData.length; i++)
    {
        var tagStr = FormatTagStr(serversData, tagsData, i);          

        var date_create = dateHelper.getShortDateString(new Date(parseInt(serversData[i].date_create, 10)));
        var date_update = dateHelper.getShortDateString(new Date(parseInt(serversData[i].date_update, 10)));

        var buttonCopyInfo = '<button onClick="copyTdIpInfo('+serversData[i].id+')" class="btn btn-warning btn-mini">Copy ip</button>&nbsp;';
        var buttonEditTag = '<a href="/servers-edit-tags?id='+serversData[i].id+'" class="btn btn-success btn-mini">Edit Tags</a>&nbsp;';
        var buttonShowLog = '<a href="/logs-server?id='+serversData[i].id+'" class="btn btn-info btn-mini">Show Log</a>&nbsp;';
        var buttonPause = '<a href="/servers-edit?todo=pause-run&id='+serversData[i].id+'" class="btn btn-primary btn-mini">Pause/Run</a>&nbsp;';
        var buttonDeleteServer = '<a href="/servers-edit?action=delete&id='+serversData[i].id+'" class="btn btn-danger btn-mini">Delete</a>&nbsp;';              

        tableData +=
        '<tr class="odd gradeX">'+
            '<td style="text-align:center;"><input type="checkbox" name="chBox[]" class="checker" value="'+serversData[i].id+'" /></td>'+
            '<td>'+serversData[i].id+'</td>'+
            '<td id="'+serversData[i].id+'-ip">'+serversData[i].ip+'</td>'+
            '<td>'+state[serversData[i].state]+'</td>'+
            '<td>'+date_create+'</td>'+
            '<td>'+date_update+'</td>'+
            '<td>'+tagStr+'</td>'+
            '<td>'+is_paused[serversData[i].is_paused]+'</td>'+
            '<td>'+buttonCopyInfo+buttonEditTag+buttonShowLog+buttonPause+buttonDeleteServer+'</td>'+
        '</tr>'; 
    }

    return tableData;
}

exports.generateTagTable = generateTagTable;
exports.generateServerTable = generateServerTable;