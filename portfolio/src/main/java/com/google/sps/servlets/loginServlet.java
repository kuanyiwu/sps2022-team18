// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps.servlets;

import com.google.cloud.datastore.Datastore;
import com.google.cloud.datastore.DatastoreOptions;
import com.google.cloud.datastore.Entity;
import com.google.cloud.datastore.Query;
import com.google.cloud.datastore.QueryResults;
import com.google.cloud.datastore.StructuredQuery.OrderBy;
import com.google.datastore.v1.Key;
import com.google.gson.Gson;
import com.google.sps.Task;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet responsible for listing tasks. */
@WebServlet("/login")
public class loginServlet extends HttpServlet {

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String email = request.getParameter("email");
    String password = request.getParameter("password");
    
    Datastore datastore = DatastoreOptions.getDefaultInstance().getService();
    Query<Entity> query =
        Query.newEntityQueryBuilder().setKind("Task").build();
    QueryResults<Entity> results = datastore.run(query);

    /*
    Filter propertyFilter =
        new FilterPredicate("email", FilterOperator.EQUAL, email);
    Query q = new Query("Task").setFilter(propertyFilter);
*/

    List<Task> tasks = new ArrayList<>();
    while (results.hasNext()) {
      Entity entity = results.next();

      String em = entity.getString("email");
      String psw = entity.getString("password");

      if (email.equals(em) && password.equals(psw))
      {
        response.sendRedirect("/index.html");
      }

      Task task = new Task(em, psw);
      tasks.add(task);
    }
    response.sendRedirect("/login.html");
  }
}