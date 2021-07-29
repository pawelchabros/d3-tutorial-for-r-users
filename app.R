library(shiny)
library(purrr)

ui <- fluidPage(
  tags$head(
    tags$link(rel = "stylesheet", type = "text/css", href = "style.css"),
    tags$script(src = "index.js"),
    tags$script(src = "d3.min.js")
  ),
  div(
    class = "card",
    actionButton(inputId = "update", label = "It's alive!"),
    tags$svg(
      tags$g(
        class = "plot",
        tags$g(class = "axis-x"),
        tags$g(class = "axis-y")
      )
    )
  )
)

server <- function(input, output, session) {
  generate_data <- function() {
    data.frame(
      category = c("A", "B", "C"),
      value = runif(3) * 100
    )
  }
  render_barplot <- function() {
    session$sendCustomMessage("render_barplot", transpose(generate_data()))
  }
  render_barplot()
  observeEvent(input$update, {
    render_barplot()
  })
}

shinyApp(ui, server)
