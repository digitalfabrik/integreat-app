pipeline {
  agent any

  stages {
    stage('Test') {
      steps {
        sh 'yarn'
        sh 'yarn run flow'
        sh 'yarn run lint'
        sh 'yarn run test --ci'
        sh 'yarn run test:coverage --ci'
      }
    }
    stage('Build') {
      steps {
        sh 'yarn run build'
      }
    }
  }

  post {
    always {
      junit 'junit.xml'

      step([
        $class              : 'CloverPublisher',
        cloverReportDir     : '__coverage__',
        cloverReportFileName: 'clover.xml',
        healthyTarget       : [methodCoverage: 70, conditionalCoverage: 80, statementCoverage: 80],
        unhealthyTarget     : [methodCoverage: 50, conditionalCoverage: 50, statementCoverage: 50],
        failingTarget       : [methodCoverage: 0, conditionalCoverage: 0, statementCoverage: 0]
      ])

      cleanWs()
    }
  }
}
