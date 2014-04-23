---
layout: default
title: courses.contents
categories: courses
---
<a href="../#groovy-and-grails-training" class="btn btn-warning pull-right">{% t courses.back %}</a>
<h1>{% t courses.GroovyAndGrails.title %}</h1>
<hr>
{% assign details = 'courses.GroovyAndGrails.details' %}
{% include course-attrs.html i18nRoot=details %}
<hr>
<div class="row-fluid">
  <section id="goals" class="span6">
    {% include course-objectives.html i18nRoot=details %}
    <h2>{% t AfterCourse %}</h2>
    {% capture after %}{{ details }}.after.intro{% endcapture %}
    {% t after %}
    {% capture after %}{{ details }}.after.bullets{% endcapture %}
    {% include bullets.html bullets=after %}
  </section>
  <section class="span6">
    {% capture syllabus %}{{ details }}.syllabus{% endcapture %}
    {% include syllabus.html syllabus=syllabus %}
  </section>
</div>