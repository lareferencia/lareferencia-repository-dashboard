package org.lareferencia.core.dashboard.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@CrossOrigin
public class HomeController {
    @RequestMapping("/")
    public String home() {
        return "redirect:swagger-ui.html";
    }
}