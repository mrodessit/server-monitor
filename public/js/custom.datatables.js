
$.fn.dataTable.ext.search.push(	
	function( settings, data, dataIndex ) {
		var includeSearchArr = [];
		var interceptSearchArr = [];
		
		var csearch = $('#custom-search').val();

		if (csearch.length <=1 ) return true;

		csearch = csearch.split(' ');

		for(var i=0; i<csearch.length; i++)
		{
			if (csearch[i].charAt(0) == '!') interceptSearchArr.push(csearch[i].slice(1));
			else includeSearchArr.push(csearch[i]);			
		}		

		var result = true;

		for (var i=0; i<includeSearchArr.length; i++)
		{
			if (data[6].indexOf(includeSearchArr[i]) >= 0) 
			{
				result = true;				
			}
			else
			{
				result = false;
				break;
			}
		}

		for(var i=0; i<interceptSearchArr.length; i++)
		{
			if (data[6].indexOf(interceptSearchArr[i]) >= 0)
			{
				result = false;
				break;
			}
		}

		return result;
	}
);

$(document).ready(function(){
	
	var table = $('.data-table').DataTable({		
		"bJQueryUI": true,
		"aLengthMenu": [[10, 50, 100, -1], [10, 50, 100, "All"]],
		"sPaginationType": "full_numbers",
		"sDom": '<""l>t<"F"fp>'
	});

	$('#custom-search').keyup( function() {		
		table.draw();		
    } );
	
	//$('input[type=checkbox],input[type=radio],input[type=file]').uniform();
	
	$('select').select2();
	
	$("span.icon input:checkbox, th input:checkbox").click(function() {
		var checkedStatus = this.checked;
		var checkbox = $(this).parents('.widget-box').find('tr td:first-child input:checkbox');		
		checkbox.each(function() {
			this.checked = checkedStatus;
			if (checkedStatus == this.checked) {
				$(this).closest('.checker > span').removeClass('checked');
			}
			if (this.checked) {
				$(this).closest('.checker > span').addClass('checked');
			}
		});
	});	
});

function copyAllCheckedIp()
{
    var ipArr = [];

    var idArr = $("input[name='chBox[]']:checkbox:checked").map(function() {
        return this.value;
    }).get();

    for(var i=0; i<idArr.length; i++)
    {
        var element = '#'+idArr[i]+'-ip';
        ipArr.push($(element).html());
    }

    copyToClipboard(ipArr.join(','));
}

function tagAllCheckedIp()
{
    var idArr = $("input[name='chBox[]']:checkbox:checked").map(function() {
        return this.value;
    }).get();

    if (idArr.length > 0)
    {
        window.location = "/server-edit?action=edit-tag&idArr=" + idArr.join(',');
    }
}

function statusAllCheckedIp()
{
    var idArr = $("input[name='chBox[]']:checkbox:checked").map(function() {
        return this.value;
    }).get();

    if (idArr.length > 0)
    {
        window.location = "/server-edit?todo=pause-run&idArr=" + idArr.join(',');
    }
}

function deleteAllCheckedIp()
{
    var idArr = $("input[name='chBox[]']:checkbox:checked").map(function() {
        return this.value;
    }).get();

    if (idArr.length > 0)
    {
        window.location = "/server-edit?action=delete&idArr=" + idArr.join(',');
    }
}

function copyTdIpInfo(id)
{
    var element = '#'+id+'-ip';
    copyToClipboard($(element).html());
}

function copyToClipboard(text) {
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val(text).select();
  document.execCommand("copy");
  $temp.remove();
}

