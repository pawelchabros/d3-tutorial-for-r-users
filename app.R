library(shiny)
library(glue)
library(purrr)

svg_width <- 500
svg_height <- 200
margin <- list(
  top = 30,
  right = 10,
  bottom = 30,
  left = 30
)
plot_width <- svg_width - margin$left - margin$right
plot_height <- svg_height - margin$top - margin$bottom

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
      width = svg_width,
      height = svg_height,
      tags$g(
        class = "plot",
        transform = glue("translate({margin$left}, {margin$top})"),
        tags$g(
          class = "axis-x",
          transform = glue("translate(0, {plot_height})"),
        ),
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
    session$sendCustomMessage("render_barplot", list(
      dummyData = transpose(generate_data()),
      plotWidth = plot_width,
      plotHeight = plot_height
    ))
  }
  render_barplot()
  observeEvent(input$update, {
    render_barplot()
  })
}

shinyApp(ui, server)
