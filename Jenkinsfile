pipeline {
  agent any

  stages {
    stage('Test') {
      steps {
        sh 'yarn'
        sh 'yarn run flow'
        sh 'yarn run lint'
        sh 'yarn run test --coverage'
      }
    }
    stage('Build') {
      steps {
        sh 'yarn run build:debug'
      }
    }
  }
}
