# PreSCF组件使用说明

该组件是为了兼容老版本的SCFCLI以及VSCode插件独立开发的。通过该组件，可以简单快速的将原有的函数进行部署。

该组件的Yaml只有两个字段，分别是`yaml`和`region`，其中`yaml`表示相对的原始的yaml存放地，`region`表示要部署的区域，默认是`ap-guangzhou`


```yml
# serverless.yml
helloWorld:
  component: "@gosls/tencent-prescf"
  inputs:
    yaml: ./template.yaml
    region: ap-guangzhou
```

例如我目录结构：
```text
hello_world
|- .gitignore
|- index.py
|- README.md
|- template.yaml
```

此时，我只需要新建`serverless.yaml`：
```text
hello_world
|- .gitignore
|- index.py
|- README.md
|- serverless.yaml
|- template.yaml
```

内容为：
```yml
# serverless.yml
helloWorld:
  component: "@gosls/tencent-prescf"
  inputs:
    yaml: ./template.yaml
    region: ap-guangzhou
```

完成之后，直接部署：
```text
DFOUNDERLIU-MB0:hello_world dfounderliu$ sls --debug

  DEBUG ─ Resolving the template's static variables.
  DEBUG ─ Collecting components from the template.
  DEBUG ─ Downloading any NPM components found in the template.
  DEBUG ─ Analyzing the template's components dependencies.
  DEBUG ─ Creating the template's components graph.
  DEBUG ─ Syncing template state.
  DEBUG ─ Executing the template's components graph.
  DEBUG ─ Compressing function hello_world file to /Users/dfounderliu/Desktop/ServerlessComponents/test/oldscf/hello_world/.serverless/hello_world.zip.
  DEBUG ─ Compressed function hello_world file successful
  DEBUG ─ Updating code... 
  DEBUG ─ Updating configure... 
  DEBUG ─ Created function hello_world successful
  DEBUG ─ Setting tags for function hello_world
  DEBUG ─ Creating trigger for function hello_world
  DEBUG ─ Deployed function hello_world successful

  helloWorld: 
    - 
      Name:        hello_world
      Runtime:     Python3.6
      Handler:     index.main_handler
      MemorySize:  128
      Timeout:     3
      Region:      ap-guangzhou
      Namespace:   anycodes
      Description: This is a template function

  11s › helloWorld › done

```

移除：
```text
DFOUNDERLIU-MB0:hello_world dfounderliu$ sls remove --debug

  DEBUG ─ Flushing template state and removing all components.
  DEBUG ─ Removing function
  DEBUG ─ Request id
  DEBUG ─ Removed function hello_world successful

  4s › helloWorld › done

```
