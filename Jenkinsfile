
pipeline {
    agent any

    triggers {
        githubPush()
    }

    stages {
        stage('Verify Jenkins Environment') {
            steps {
                sh '''
                    echo "Jenkins user:"
                    whoami

                    echo "Java version:"
                    java -version

                    echo "Ansible version:"
                    ansible --version
                '''
            }
        }

        stage('Deploy Application using Ansible') {
            steps {
                sh '''
                    ansible-playbook \
                    -i /var/lib/jenkins/ansible/contact-manager/inventory.ini \
                    /var/lib/jenkins/ansible/contact-manager/deploy.yml
                '''
            }
        }
    }
}
