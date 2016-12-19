var filtrosDesplegados = false;
var botonSubmitFiltros = '<div width="100%" id="container_boton_submit"><button id="boton_submit" type="button">BUSCAR</button></div>';
var consultaAnterior = "select * from (select po.ID as post_id, co.comment_author_email as email, co.comment_author as autor,co.comment_ID, co.comment_content, CONVERT(SUBSTRING_INDEX(cm.meta_value,\"-\",-1),UNSIGNED INTEGER) AS num_votos, co.comment_date from wp_comments co JOIN wp_posts po ON co.comment_post_ID = po.ID JOIN wp_postmeta pm ON po.ID = pm.post_id JOIN wp_commentmeta cm ON cm.comment_id = co.comment_ID WHERE co.comment_date > DATE_SUB(NOW(), INTERVAL 1 YEAR) AND cm.meta_key = 'wpdiscuz_votes' ORDER BY co.comment_date DESC ) tabla group by post_id ORDER BY num_votos DESC ";
var numeroPagina = 1;
var estaPidiendo = false;
numeroComentario = 10;

var plantillaComentario = '<div class="card-1">' +
                            '<div style="width: 100%; display: inline-block">' +
                                '<div class="titulo">TITULO</div>' +
                                '<div class="categoria">CATEGORIA</div>' +
                            '</div>' +
                    '<div>' +
                        '<div style="height: 100%; vertical-align: top; display: inline-block" class="contenedor_avatar"><a href="HREFAUTOR"><div class="avatar2">AVATAR</div></a></div>' +
                        '<div id="contenido_NUMERO_COMENTARIO" onclick="desplegar(NUMERO_COMENTARIO3)" class="contenido">CONTENIDO_COMENTARIO</div>' +
                    '</div>' +

                    '<div>' +
                        '<div style="display:inline-block">' +
                            '<div class="boton_social"><a target="_blank" href="ENLACE_FACEBOOK"><i class="fa fa-facebook-official" aria-hidden="true"></i></a></div>' +
                            '<div class="boton_social"><a target="_blank" href="ENLACE_TWITTER"><i class="fa fa-twitter" aria-hidden="true"></i></a></div>' +
                        '</div>' +
                        '<div class="botonera">' +
                            '<div class="boton" onclick="desplegar(NUMERO_COMENTARIO2)"><a>Leer <i class="fa fa-plus" aria-hidden="true"></i></a></div>' +
                            '<div class="boton"><a href="ENLACE">Continuarlo <i class="fa fa-commenting-o" aria-hidden="true"></i></a></div>' +
                        '</div>' +
                    '</div>' +
                  '</div>' +

                 '<div class="separator"></div>';


jQuery('#siguiendo').click(function (){
    jQuery('#no_siguiendo').prop('checked', false);
});    

jQuery('#no_siguiendo').click(function (){
    jQuery('#siguiendo').prop('checked', false);
});    

jQuery('#mas_votados').click(function (){
    jQuery('#menos_votados').prop('checked', false);
});    

jQuery('#menos_votados').click(function (){
    jQuery('#mas_votados').prop('checked', false);
});  

jQuery('#boton_filtrar').click(function (){

    if (filtrosDesplegados) {
        jQuery('#contenedor_filtros').hide();
        jQuery('#boton_filtrar').css('background-color', "transparent");
        filtrosDesplegados = false;
    }else {
        jQuery('#contenedor_filtros').show();
        jQuery('#boton_filtrar').css('background-color', "#f2f2f2");
        filtrosDesplegados = true;
    }
}); 

jQuery('#boton_cerrar_filtros').click(function (){
    jQuery('#contenedor_filtros').hide();
}); 

jQuery(document).ready( function (){

    jQuery('.avatar2 img').removeClass();
    jQuery('.avatar2 img').addClass("avatar");

    //Insertamos los filtros
    filtros = '<div id="filtro_categorias_contenido" style="display:none">';

    for (i = 0; i < categoriasJS.length; i++){
        if (i == 0){
            filtros += '<div style="margin-top: 15px;display: inline-block"><input class="checkbox_categoria" type="checkbox" checked value="' + categoriasJS[i].id + '"/>' + categoriasJS[i].nombre + '</div>';
        }else{
            filtros += '<div style="margin-top: 15px;display: inline-block"><input class="checkbox_categoria" type="checkbox" value="' + categoriasJS[i].id + '"/>' + categoriasJS[i].nombre + '</div>';
        }
    }


    filtros +=  '</div><div id="filtro_temporalidad_contenido" style="display:none">' +
                                        '<select id="temporalidad" name="temporalidad" style="margin-bottom: 0px">' +
                                            '<option selected="selected" value="1">Los más recientes</option>' +
                                            '<option value="2">De la última semana</option>' +
                                            '<option value="3">Del último mes</option>' +
                                            '<option value="4">De los últimos 6 meses</option>' +
                                            '<option value="5">Del último año</option>' +
                                            '<option value="6">Todos</option>' +
                                        '</select>' +
                                    '</div>' +
                                    '<div id="filtro_votos_contenido" style="display:none">' +
                                        '<input class="checkbox_general" checked="checked" id="mas_votados" type="checkbox"/>Más votados' +
                                        '<input class="checkbox_general" id="menos_votados" type="checkbox"/>Menos votados' +
                                    '</div>'+
                                    '<div id="filtro_followers_contenido" style="display:none">' +
                                        '<input class="checkbox_general" id="siguiendo" type="checkbox"/>Siguiendo' +
                                        '<input class="checkbox_general" id="no_siguiendo" type="checkbox"/>No Siguiendo' +
                                    '</div>' + botonSubmitFiltros;

    jQuery('#filtros_contenido').html(filtros);

    setButtonListener();
    setCheckboxCategoriasListeners();

    jQuery(window).scroll(function() {
       if(jQuery(window).scrollTop() > 0) {
            scroll = jQuery(window).scrollTop();
            altoCuerpo = jQuery( '#contenido' ).height();
            console.log("evento scroll" + (altoCuerpo - scroll));
        
            if (altoCuerpo - scroll < 320){
                //Aqui cargamos mas comentarios
                getMoreComments();
            }
        }   
   });

});



function getMoreComments(){
    consulta = consultaAnterior + " LIMIT " + (numeroPagina * 10) + ", 10";
    console.log("Pagina:" + numeroPagina);

    if (!estaPidiendo) {
        estaPidiendo = true;
        //Mostramos el spinner
        jQuery('#spinner_comentarios').show();
        peticionAjaxComentarios(consulta, true);
    }

}


jQuery("#boton_filtrar").hover(function(){
    jQuery('#boton_filtrar').css('background-color', "#f2f2f2");
});


jQuery("#boton_filtrar").mouseleave(function(){
    if (!filtrosDesplegados) {
        jQuery('#boton_filtrar').css('background-color', "transparent");
    }
});



jQuery("#filtro_categorias").click(function(){
    jQuery("#fila_filtros").show();

    jQuery('#filtro_categorias_contenido').show();
    jQuery('#filtro_temporalidad_contenido').hide();
    jQuery('#filtro_votos_contenido').hide();
    jQuery('#filtro_followers_contenido').hide();

});

jQuery("#filtro_temporal").click(function(){
    jQuery("#fila_filtros").show();

    jQuery('#filtro_categorias_contenido').hide();
    jQuery('#filtro_temporalidad_contenido').show();
    jQuery('#filtro_votos_contenido').hide();
    jQuery('#filtro_followers_contenido').hide();

});

jQuery("#filtro_votos").click(function(){
    jQuery("#fila_filtros").show();

    jQuery('#filtro_categorias_contenido').hide();
    jQuery('#filtro_temporalidad_contenido').hide();
    jQuery('#filtro_votos_contenido').show();
    jQuery('#filtro_followers_contenido').hide();

});

jQuery("#filtro_followers").click(function(){
    jQuery("#fila_filtros").show();

    jQuery('#filtro_categorias_contenido').hide();
    jQuery('#filtro_temporalidad_contenido').hide();
    jQuery('#filtro_votos_contenido').hide();
    jQuery('#filtro_followers_contenido').show();

});

function setButtonListener(){
    jQuery('#boton_submit').click(function () {
        jQuery('#contenedor_filtros').hide();
        jQuery('#boton_filtrar').css('background-color', "transparent");

        filtrosDesplegados = false;
        console.log("submit");
        //Vaciamos el array de comentarios
        console.log(comentarios);

        comentarios = [];
        numeroComentario = 0;
        numeroPagina = 0;

        //QUITAR
        temporalidad = jQuery('#temporalidad').prop('selectedIndex');
        masVotado = true;
        siguiendo = "nada";

        if (jQuery('#siguiendo').prop('checked'))
            siguiendo = true;

        if (jQuery('#no_siguiendo').prop('checked'))
            siguiendo = false;

        if (jQuery('#menos_votados').prop('checked'))
            masVotado = false;


        console.log('Temporalidad:' + temporalidad);
        console.log('Siguendo:' + siguiendo);
        console.log('Mas votado:' + masVotado);


        consulta = "select * from (select po.ID as post_id, co.comment_author_email as email, co.comment_author as autor,co.comment_ID, co.comment_content, CONVERT(SUBSTRING_INDEX(cm.meta_value,\"-\",-1),UNSIGNED INTEGER) AS num_votos, co.comment_date from wp_comments co JOIN wp_posts po ON co.comment_post_ID = po.ID JOIN wp_postmeta pm ON po.ID = pm.post_id JOIN wp_commentmeta cm ON cm.comment_id = co.comment_ID WHERE ";

        switch (temporalidad) {
            case 0:
                //Ultimo día
                consulta += "co.comment_date > DATE_SUB(NOW(), INTERVAL 1 DAY)";
                break;
            case 1:
                consulta += "co.comment_date > DATE_SUB(NOW(), INTERVAL 7 DAY)";
                break;
            case 2:
                consulta += "co.comment_date > DATE_SUB(NOW(), INTERVAL 1 MONTH)";
                break;
            case 3:
                consulta += "co.comment_date > DATE_SUB(NOW(), INTERVAL 6 MONTH)";
                break;
            case 4:
                consulta += "co.comment_date > DATE_SUB(NOW(), INTERVAL 1 YEAR)";
                break;
        }

        if (siguiendo !== 'nada') {
            if (siguiendo) {
                consulta += " AND co.user_id IN (SELECT fo.user_id1 from wp_um_followers fo where fo.user_id2 = " + idUsuario + ") ";
            } else {
                consulta += " AND co.user_id NOT IN (SELECT fo.user_id1 from wp_um_followers fo where fo.user_id2 = " + idUsuario + ") ";
            }
        }

        //Obtenemos las categorias
        checksChecked = jQuery('input:checkbox[class=checkbox_categoria]:checked');
        strCategorias = "("

        if (checksChecked.length > 0) {
            if (checksChecked[0].value != 0) {
                for (i = 0; i < checksChecked.length; i++){
                    strCategorias += checksChecked[i].value + ",";
                }
            }
        }

        strCategorias = strCategorias.substr(0, strCategorias.length - 1);
        strCategorias += ")"

        if (strCategorias != ")") {
            consulta += " AND pm.meta_value IN " + strCategorias;
        }


        consulta += " AND cm.meta_key = 'wpdiscuz_votes' ORDER BY co.comment_date DESC ) tabla group by post_id";

        if (masVotado){
            consulta += " ORDER BY num_votos DESC ";
        }else{
            consulta += " ORDER BY num_votos ASC ";
        }

        consultaAnterior = consulta;
        //alert(consulta);
        consulta += " LIMIT 10;";

        console.log(consulta);

        peticionAjaxComentarios(consulta, false);

    });
}


function setCheckboxCategoriasListeners(){
    checks = jQuery('.checkbox_categoria');

    for (i = 0; i < checks.length; i++){
        checks[i].addEventListener("change", function(){
            checksChecked = jQuery('input:checkbox[class=checkbox_categoria]:checked');

            console.log(checksChecked);

            if (checksChecked.length == 0){
                checks[0].checked = true;
            }else{
                if (this.value != 0) {
                    checks[0].checked = false;
                }else{
                    if (checks[0].checked == true){
                        jQuery('input:checkbox[class=checkbox_categoria]:checked').removeAttr('checked');
                        checks[0].checked = true;
                    }
                }
            }
        });
    }
}



function peticionAjaxComentarios(consulta, paginacion){

    console.log("pido");
    jQuery.ajax({
        // la URL para la petición
        url : MyAjax.ajaxurl,

        //ajaxurl+"?action=get_comments_ajax",

        // la información a enviars
        // (también es posible utilizar una cadena de datos)
        data : { consulta: consulta, action : 'cwp_get_comments_ajax' },

        // especifica si será una petición POST o GET
        type : 'POST',

        // el tipo de información que se espera de respuesta
        dataType : 'text',

        // código a ejecutar si la petición es satisfactoria;
        // la respuesta es pasada como argumento a la función
        success : function(result) {
            //alert(result);
            comments = JSON.parse(result);
            commentsHTML = "";
            //alert(result);
            console.log(comments);

            for (i = 0 ; i < comments.length ; i++ ) {
                //alert(comment.comment_ID);
                nuevoComentario = plantillaComentario;
                //Sustituimos los valores de la plantilla por el contenido
                contenido = "";

                if (comments[i].contenido.length > 250){
                    contenido = comments[i].contenido.substr(0, 250) + "...";
                }else{
                    contenido = comments[i].contenido;
                }

                nuevoComentario = nuevoComentario.replace("TITULO", comments[i].titulo);
                nuevoComentario = nuevoComentario.replace("CONTENIDO_COMENTARIO", contenido);
                nuevoComentario = nuevoComentario.replace("NUMERO_COMENTARIO", numeroComentario);
                nuevoComentario = nuevoComentario.replace("NUMERO_COMENTARIO2", numeroComentario);
                nuevoComentario = nuevoComentario.replace("NUMERO_COMENTARIO3", numeroComentario);

                nuevoComentario = nuevoComentario.replace("AVATAR", comments[i].avatar);
                nuevoComentario = nuevoComentario.replace("ENLACE", comments[i].enlace);
                nuevoComentario = nuevoComentario.replace("ENLACE_FACEBOOK", comments[i].enlace_facebook);
                nuevoComentario = nuevoComentario.replace("ENLACE_TWITTER", comments[i].enlace_twitter);
                nuevoComentario = nuevoComentario.replace("HREFAUTOR", comments[i].enlace_autor);
                nuevoComentario = nuevoComentario.replace("CATEGORIA", comments[i].categoria_sin_acentos);

                commentsHTML += nuevoComentario;
                //Anyadimos el comentario al array de comentarios
                comentarios.push(comments[i].contenido);
                console.log("anyado");

                numeroComentario++;
                //console.log(comentarios);
            }


            if (paginacion) {
                jQuery('#contenido').html(jQuery('#contenido').html() + commentsHTML);
            }else {
                jQuery('#contenido').html(commentsHTML);
            }

            jQuery('.avatar2 img').removeClass();
            jQuery('.avatar2 img').addClass("avatar");

            estaPidiendo = false;
            jQuery('#spinner_comentarios').hide();

            numeroPagina++;
            console.log(consulta);
        },

        // código a ejecutar si la petición falla;
        // son pasados como argumentos a la función
        // el objeto de la petición en crudo y código de estatus de la petición
        error : function(xhr, status) {
            estaPidiendo = false;
            alert('Disculpe, existió un problema');
        }
    });


}