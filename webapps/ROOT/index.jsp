<%@ page contentType="text/ht ml; encoding=utf-8"%>
<%@ page import="java.util.*" %>
<html>
 
<%! String name; %>
<%! String age; %>
<%! List<String> messages; %>
 
<%
    messages = new ArrayList<String>();
    int ageInt = 0;
    name = request.getParameter("name");
    age = request.getParameter("age");
 
    if(name == null || age == null){
        messages.add("Необходимо ввести все данные.");
    }else{
        try{
            ageInt = Integer.valueOf(age);
 
            if(!name.endsWith("junior") && !name.endsWith("middle") && !name.endsWith("senior")){
                if(ageInt <= 18){
                    name += " junior";
                }else if(ageInt > 18 && ageInt < 30){
                    name += " middle";
                }else{
                    name += " senior";
                }
            }
        }catch(NumberFormatException e){
            age = null;
            messages.add("Неверный формат возраста.");
        }
    }
 
%>
    <form action="scriptlet.jsp" method="POST">
        <center>
            <table>
                <% if(messages.size() > 0){ %>
                    <tr>
                        <td colspan="2">
                            Ошибки
                        </td>
                    <% for(String str : messages){ %>
                        <td colspan="2">
                            <%= messages %>
                        </td>
                    <% } %>
                    </tr>
                <% } %>
                <% if(name != null){ %>
                    <tr>
                <% }else{ %>
                    <tr style="border: 1px solid red;">
                <% } %>
                    <td>
                        Имя:
                    </td>
                    <td>
                        <input type="text" name="name" value="<%= name %>"/>
                    </td>
                </tr>
                <% if(age != null){ %>
                    <tr>
                <% }else{ %>
                    <tr style="border: 1px solid red;">
                <% } %>
                    <td>
                        Возраст:
                    </td>
                    <td>
                        <input type="text" name="age" value="<%= age %>"/>
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <input type="submit" value="Отправить"/>
                    </td>
                </tr>
            </table>
        </center>
    </form>
</html>